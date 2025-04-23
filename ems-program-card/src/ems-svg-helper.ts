import { svg } from "lit";
import { SwitchTime, Program, EmsCard } from "./ems-card"

// Constants for SVG
const offY = 30;
const onY = 0;
const secondsToPx = 240 / 86400;

// Returns whether the last state value of a program is low or high
function getLastState(dayIds: string[], program: Program): number {
  const lastState = dayIds.reverse().some((wdId) => {
    const stList = program[wdId];
    return stList.length > 0 ? stList[stList.length - 1].state : false;
  });
  return lastState ? onY : offY;
}

// Renders the SVG contents
export function renderSvg(card: EmsCard, dotClickHandler: (e: Event) => void) {
  if (!card.program || !card.programNew) {
    return;
  }

  // Calculate last program point for old and new
  let lastState = { value: getLastState(card.dayIds, card.program) };
  let lastStateNew = { value: getLastState(card.dayIds, card.programNew) };

  return svg`
  <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"
    width="100%" height="100%" version="1.1"
    viewBox="0 0 260 360">
    <defs>
        <g id="weekday_grid">
            <pattern id="grid" patternUnits="userSpaceOnUse"
                width="20" height="30" >
                <rect x="10" y="0" width="10" height="100%"
                    stroke="none" fill="gray" opacity="0.2" />
            </pattern>
            <rect width="240" height="30" fill="url(#grid)" />
            <rect width="240" height="30" fill="none"
                stroke="gray" opacity="0.2" />
            <g transform="translate(2, 15) rotate(-90)"
                font-size="7px" font-family="sans-serif" fill="grey"
                dominant-baseline="start" text-anchor="middle">
                ${Array.from({ length: 12 }, (_, i) => renderSvgTimes(i, card._hass.locale.language))}
            </g>
        </g>
    </defs>

    <g transform="translate(130, 13)"
        font-size="10px" font-family="sans-serif" fill="gray"
        dominant-baseline="start" text-anchor="middle">
        ${Object.entries(card.dayNames).map(([idx, wdName]) => svg`
          <text y="${+idx * 50}">${wdName}</text>
        `)}
    </g>

    <g transform="translate(10, 20)">
      ${Object.entries(card.dayIds).map(([idx, _]) => svg`
        <use xlink:href="#weekday_grid" y="${+idx * 50}" />
      `)}
    </g>

    ${Object.entries(card.dayIds).map(([idx, wdId]) =>
    renderSvgLines(card.program, Number(idx), wdId, "rgb(71,108,149)", lastState))}
    ${Object.entries(card.dayIds).map(([idx, wdId]) =>
      renderSvgLines(
        card.programNew,
        Number(idx),
        wdId,
        "rgb(149,108,71)",
        lastStateNew
      )
    )}
    ${Object.entries(card.dayIds).map(
      ([idx, wdId]) => svg`
      <g transform="translate(10, ${20 + +idx * 50})" fill="red">
        ${card.programNew ? Object.entries(card.programNew[wdId]).map(([idxDot, st]) =>
        renderSvgDots(wdId, Number(idxDot), st, dotClickHandler)
      ) : svg``}
      </g>
    `
    )}
  </svg>`;
}

// Renders the SVG times
function renderSvgTimes(i: number, locale: string) {
  const timeObj = new Date(0, 0, 0, 1 + i * 2, 0);
  const formattedTime = timeObj.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return svg`<text y="${10 + i * 20}">${formattedTime}</text>`;
}

// Creates an SVG line drawing switch times for a weekday
function renderSvgLines(
  program: Program | undefined,
  idx: number,
  wdId: string,
  color: string,
  lastState: { value: number }
) {
  if (!program) {
    return svg``;
  }

  let lastY = lastState.value;
  let points = `0,${lastY}`;
  for (const st of program[wdId]) {
    const stX = Math.floor(st.secondsSinceMidnight * secondsToPx);
    let stY = offY;
    if (st.state) {
      stY = onY;
    }
    if (lastY !== stY) {
      points += ` ${stX},${lastY}`;
    }
    points += ` ${stX},${stY}`;
    lastY = stY;
  }
  points += ` 240,${lastY}`;
  lastState.value = lastY;
  return svg`
    <g transform="translate(10, ${20 + idx * 50})">
      <polyline points="${points}"
          fill="none" stroke="${color}" stroke-width="3"
          stroke-opacity="0.6" />
    </g>`;
}

// Renders clickable dot for new program
function renderSvgDots(
  wdId: string,
  idxDot: number,
  st: SwitchTime,
  dotClickHandler: (e: Event) => void
) {
  const stX = Math.floor(st.secondsSinceMidnight * secondsToPx);
  let stY = offY;
  if (st.state) {
    stY = onY;
  }
  return svg`
      <circle id="${wdId}-${idxDot}" cx="${stX}" cy="${stY}" r="6.5"
        @click="${dotClickHandler}" />
    `;
}
