import { loadTranslations, localize } from "./ems-card-helper.ts";
import { Program, EmsCard } from "./ems-card"


// Access the EMS bus: writing bus input und collecting bus responses
async function accessEms(card: EmsCard, busInput: string[], stopResponse?: string) {
  // Set language
  loadTranslations(card._hass.locale.language)

  // Set maximum seconds for bus response
  const maxMs = 20000;
  const globalStartTime = Date.now();
  card.statusMessage = "";
  card.requestUpdate();

  // Collect responses from bus
  const busResponses: string[] = [];
  let busResponse = "";
  for (const [idx, value] of Object.entries(busInput)) {
    // Set value of bus
    await card._hass.callService("text", "set_value", {
      entity_id: card.config.entity_id,
      value: value,
    });
    // If a value is set, then wait for 250ms and the query wether set
    // was successful
    if (value.length > 2) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      await card._hass.callService("text", "set_value", {
        entity_id: card.config.entity_id,
        value: value.substring(0, 2),
      });
    }

    // Wait for response (detected by change of value)
    const startTime = Date.now();
    let now = startTime;
    while (now - startTime <= maxMs && !busResponse.startsWith(value)) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      // Gets value from bus
      busResponse = card._hass.states[card.config.entity_id].state;
      now = Date.now();
    }
    if (busResponse.startsWith(value)) {
      if (stopResponse && busResponse.endsWith(stopResponse)) {
        break;
      } else {
        busResponses.push(busResponse);
        card.statusMessage = ` ${Math.round(
          ((Number(idx) + 1) / busInput.length) * 100
        )} %`;
        card.requestUpdate();
      }
    } else {
      return {
        message: "ui.card.ems_program_card.error.ems_no_response",
      };
    }
  }

  // Create output:
  return {
    status: "synchronized",
    id: card.config.entity_id,
    bus: busResponses,
    duration: Date.now() - globalStartTime,
    message: "ui.card.ems_program_card.ems_success",
  };
}

// Print EMS program to string array
function printEmsProgram(program: Program | undefined, daysOfWeekIds: string[]): string[] {
  let printedProgram: string[] = [];
  let idx = 0;
  if (!program) {
    return printedProgram;
  }
  for (const wd of daysOfWeekIds) {
    if (!program[wd]) {
      continue;
    }
    for (let st of program[wd]) {
      let timeStr = st.hour + ":" + st.minute;
      let stateStr = st.state ? "on" : "off";
      printedProgram.push(
        `${idx.toString().padStart(2, "0")} ${wd} ${timeStr} ${stateStr}`
      );
      idx++;
    }
  }
  return printedProgram;
}

// Parses an EMB bus program
function parseProgram(program: string[], daysOfWeekIds: string[]): Program | undefined {
  if (!program) {
    return undefined;
  }

  const programParsed: Program = {};
  for (const wd of daysOfWeekIds) {
    programParsed[wd] = [];
  }
  for (const entry of program) {
    const parts = entry.split(" ");
    if (parts.length !== 4) continue;
    const [_, weekday, timeStr, stateStr] = parts;
    const state = stateStr === "on" ? true : false;
    const [hour, minute] = timeStr.split(":").map((str) => parseInt(str));
    const secondsSinceMidnight = hour * 3600 + minute * 60;
    programParsed[weekday].push({
      hour: String(hour).padStart(2, "0"),
      minute: String(minute).padStart(2, "0"),
      secondsSinceMidnight: secondsSinceMidnight,
      state: state,
      day: weekday,
      idx: -1,
    });
  }
  return programParsed;
}

// Clones the original program
function cloneProgram(daysOfWeekIds: string[], program?: Program): Program {
  // Do a deep copy
  let programCloned: Program = {};
  if (!program) {
    return programCloned;
  }
  for (const wd of daysOfWeekIds) {
    if (!program[wd]) {
      continue;
    }
    programCloned[wd] = [];
    for (const st of program[wd]) {
      programCloned[wd].push({ ...st });
    }
  }
  return programCloned;
}

// Sets an attribute called "program" at the entity (does not survive restart)
function setStateAttribute(card: EmsCard, data: any) {
  // Store program to entity as attributes
  const entityId = card.config.entity_id;
  const stateObj = card._hass.states[entityId];
  let attrObj = stateObj.attributes;
  if (!data && attrObj["program"]) {
    delete attrObj["program"];
  } else {
    attrObj["program"] = data;
  }
  card._hass
    .callApi("post", "states/" + entityId, {
      state: stateObj.state,
      attributes: attrObj,
    })
    .then((res) => {
      if (card.isDebugMode) {
        console.info(res);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

// Stores the program to the entity
export function storeProgram(card: EmsCard) {
  const data = {
    old: printEmsProgram(card.program, card.dayIds),
    new: printEmsProgram(card.programNew, card.dayIds),
  };

  setStateAttribute(card, data);
}

// Loads the program from the entity if available
export function loadProgram(card: EmsCard) {
  const entityId = card.config.entity_id;
  const stateObj = card._hass.states[entityId];
  if (!stateObj) {
    return;
  }
  const out = stateObj.attributes["program"];
  if (out) {
    if (card.isDebugMode) {
      console.log(out);
    }
    card.program = parseProgram(out.old, card.dayIds);
    card.programNew = parseProgram(out.new, card.dayIds);
  }
}

// Undos program changes
export function undoProgram(card: EmsCard) {
  if (!card.program) {
    return;
  }
  card.programNew = cloneProgram(card.dayIds, card.program);
  storeProgram(card);
}

// Resets stored program
export function resetProgram(card: EmsCard) {
  card.program = undefined;
  card.programNew = undefined;
  card.statusMessage = "";
  card.isRunning = false;
  setStateAttribute(card, undefined);
}

// Reads the program from the EMS bus
export function readFromEms(card: EmsCard) {
  // Store current program and make clear that we are accessing EMS bus
  card.isRunning = true;

  // Create sequence of inputs for querying bus
  const busInput = Array.from({ length: 42 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const stopResponse = "not_set";
  accessEms(card, busInput, stopResponse).then((out) => {
    card.statusMessage = localize(out.message);
    if (card.isDebugMode) {
      console.info(out);
    }
    if (out.bus) {
      card.program = parseProgram(out.bus, card.dayIds);
      card.programNew = cloneProgram(card.dayIds, card.program);
      storeProgram(card);
    }
    card.isRunning = false;
  });
}

// Writes program to EMS bus
export function writeToEms(card: EmsCard) {
  card.isRunning = true;

  // Convert programs (old and new) to EMS bus format
  const printedProgram = printEmsProgram(card.program, card.dayIds);
  const printedProgramNew = printEmsProgram(card.programNew, card.dayIds);
  if (card.isDebugMode) {
    console.info(printedProgram);
    console.info(printedProgramNew);
  }

  // Calculate difference of programs
  let delta = printedProgramNew.filter((x) => !printedProgram.includes(x));

  // Add "not_set" to programs for resetting switchTimes if new program is
  // shorter than old one
  if (printedProgramNew.length < printedProgram.length) {
    delta = delta.concat(
      Array.from(
        { length: printedProgram.length - printedProgramNew.length },
        (_, i) =>
          `${(printedProgramNew.length + i)
            .toString()
            .padStart(2, "0")} not_set`
      )
    );
  }
  if (card.isDebugMode) {
    console.info(delta);
  }

  // Write delta to EMS bus
  accessEms(card, delta).then((out) => {
    card.statusMessage = localize(out.message);
    if (card.isDebugMode) {
      console.info(out);
    }
    if (out.bus) {
      card.program = cloneProgram(card.dayIds, card.programNew);
      storeProgram(card);
    }
    card.isRunning = false;
  });
}

// Add a switch time to program via service call
export function addSwitchTime(card: EmsCard) {
  if (!card.programNew) {
    return;
  }

  const secondsSinceMidnight =
    parseInt(card.switchTime.hour) * 3600 + parseInt(card.switchTime.minute) * 60;
  const stNew = {
    day: card.switchTime.day,
    hour: card.switchTime.hour,
    minute: card.switchTime.minute,
    secondsSinceMidnight: secondsSinceMidnight,
    state: card.switchTime.state,
    idx: -1,
  };

  // Entry is replaced with new one, if it has the same time
  // Function assumes that list is sorted
  let stList = card.programNew[card.switchTime.day];
  if (stList.length > 0) {
    let stLast = stList[stList.length - 1];
    if (stLast.secondsSinceMidnight < secondsSinceMidnight) {
      // Add to end of list if latest element
      stList.push(stNew);
    } else {
      for (let i = 0; i < stList.length; i++) {
        const st = stList[i];
        if (st.secondsSinceMidnight === secondsSinceMidnight) {
          // Replace entry with same time
          stList[i] = stNew;
          break;
        } else if (st.secondsSinceMidnight > secondsSinceMidnight) {
          // Insert new entry before as soon as one entry is later
          stList.splice(i, 0, stNew);
          break;
        }
      }
    }
  }
}

// Removes an entry from the list of entries for a certain day
export function removeSwitchTime(card: EmsCard) {
  if (!card.programNew) {
    return;
  }

  let stList = card.programNew[card.switchTime.day];
  stList.splice(card.switchTime.idx, 1);
}
