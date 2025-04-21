/*
Simple gallery card for Home Assistant, which shows the photos and videos
stored in a media folder in a card. You may specify how many items are
shown per page and may navigate through the pages.
Inspired by: https://github.com/TarheelGrad1998/gallery-card
If https://github.com/chomupashchuk/delete-file-home-assistant is installed,
you may also select files and delete them (be careful :-))
*/

import {
  LitElement,
  html,
  css,
  TemplateResult,
  CSSResultGroup
} from "lit";
import { property, state, customElement } from "lit/decorators.js";

// Import CSS styles
import { styles } from './styles.ts';
import { Hass } from "./home-assistant";

interface MediaItem {
  title: string;
  media_content_type: string;
  media_content_id: string;
  url: string;
}

@customElement(import.meta.env.VITE_HA_CARD_ID)
export class SimpleGalleryCard extends LitElement {
  // Load custom styles to card
  static styles: CSSResultGroup = styles;

  // Define custom properties, which cause card re-rendering
  @property({ attribute: false })
  public _hass!: Hass;

  @state() private config: any;
  @state() private mediaList: MediaItem[] = [];
  @state() private mediaListShown: MediaItem[] = [];
  @state() private mediaListDelete: MediaItem[] = [];
  @state() private mediaItemShown?: MediaItem;
  @state() private currentPage = 1;
  @state() private pageSize = 4;
  @state() private maxPage = 1;
  @state() private confirmDelete = false;
  @state() private hasDelete = false;
  @state() private isDebugMode = false;

  // Define default values for custom properties
  constructor() {
    super();

    // Checks whether program runs in debug mode
    const urlParams = new URLSearchParams(window.location.search);
    this.isDebugMode = urlParams.has('debug') && urlParams.get('debug') === '1';
  }

  // Displays configuration info 
  setConfig(config: any): void {
    if (!config.media_content_id) {
      throw new Error(
        "You must define a media content id, which defines a directory. " +
        "Example: 'media-source://media_source/local/myfolder/', which " +
        "refers to folder named 'myfolder' in your local media folder."
      );
    }
    this.config = config;
  }

  // HA calls this method for transferring the Hass object to the card
  set hass(hass: Hass) {
    this._hass = hass;
    this._loadResources();
  }

  // Define size of card
  getCardSize(): number {
    return 5;
  }

  // Render card
  render(): TemplateResult {
    const title = this.config.title ? this.config.title : "";
    this._updateMediaListShown();

    return html` <ha-card header="${title}">
      <div class="displayBox">
        ${this.mediaItemShown
        ? html`
              ${this._renderMediaItem(this.mediaItemShown, "mediaDisplay")}
              ${this.mediaItemShown.title}
            `
        : html`No media to display`}
      </div>
      <div class="controlBox">
        <ha-icon
          @click="${() => this._setPage(this.currentPage - 1)}"
          icon="mdi:arrow-left-bold"
          class="navigation ${this.currentPage == 1 ? "transparent" : ""}"
        ></ha-icon>
        <ha-icon
          @click="${() => this._setPage(this.currentPage + 1)}"
          icon="mdi:arrow-right-bold"
          class="navigation ${this.currentPage == this.maxPage
        ? "transparent"
        : ""}"
        ></ha-icon>
        <ha-icon
          @click="${this._reloadMedia}"
          icon="mdi:reload"
          class="navigation"
        ></ha-icon>
        ${this.hasDelete
        ? html`
              ${this.mediaListDelete.length == this.mediaList.length
            ? html`<ha-icon
                    @click="${this._deselectAllMedia}"
                    icon="mdi:cancel"
                    class="navigation"
                  ></ha-icon>`
            : html`<ha-icon
                    @click="${this._selectAllMedia}"
                    icon="mdi:select-all"
                    class="navigation"
                  ></ha-icon>`}
            `
        : html``}
        <span style="float:right">
          ${this.mediaListDelete.length > 0 && this.hasDelete
        ? html`
                ${this.mediaListDelete.length}
                <ha-icon
                  @click="${() => (this.confirmDelete = true)}"
                  icon="mdi:delete"
                  class="navigation"
                ></ha-icon>
              `
        : ``}
          ${this.confirmDelete && this.hasDelete
        ? html`
                <ha-icon
                  @click="${this._deleteMedia}"
                  icon="mdi:check-bold"
                  class="navigation"
                ></ha-icon>
                <ha-icon
                  @click="${() => (this.confirmDelete = false)}"
                  icon="mdi:close-thick"
                  class="navigation"
                ></ha-icon>
              `
        : ``}
        </span>
      </div>
      <div class="pagesBox">
        ${Array(this.maxPage)
        .fill(0)
        .map(
          (_, i) => html`<span
                @click="${() => this._setPage(i + 1)}"
                class="pageNumber"
                style="${this.currentPage == i + 1
              ? css`
                      text-decoration:underline
                    `
              : ``}"
                >${i + 1}</span
              >${this.maxPage > i + 1 ? html`` : ``}`
        )}
      </div>
      <table class="selectBox">
        ${this.mediaListShown.map(
          (mediaItem) => html`
            <tr
              class="${mediaItem == this.mediaItemShown ? "transparent" : ""}"
            >
              <td @click="${() => this._setMedia(mediaItem)}">
                ${this._renderMediaItem(mediaItem, "mediaPreview")}
              </td>
              <td>
                ${mediaItem.title}
                ${this.hasDelete
              ? html`
                      <br />
                      ${this.mediaListDelete.includes(mediaItem)
                  ? html` <ha-icon
                            @click="${() =>
                      this._removeMediaToDelete(mediaItem)}"
                            icon="mdi:delete-restore"
                            class="navigation"
                          ></ha-icon>`
                  : html`
                            <ha-icon
                              @click="${() =>
                      this._addMediaToDelete(mediaItem)}"
                              icon="mdi:delete-outline"
                              class="navigation"
                            ></ha-icon>
                          `}
                    `
              : html``}
              </td>
            </tr>
          `
        )}
      </table>
    </ha-card>`;
  }

  // Loads all resources required; i.e., fills the media list and updates
  // list of media shown depending on selected page.
  private async _loadResources(): Promise<void> {
    // Determine page size
    if (this.config.page_size) {
      this.pageSize = this.config.page_size;
    }

    // Browse media if list not filled already
    if (this.mediaList.length > 0) {
      return;
    }
    this.mediaList = [];
    const commands: Promise<void>[] = [];
    this._fillMediaList(commands, this.config.media_content_id);

    // Determine whether delete service is available under components
    commands.push(
      this._hass
        .callWS({
          type: "get_config",
        })
        .then((wsResponse) => {
          this.hasDelete = wsResponse.components.includes("delete");
        })
    );

    // Wait for everything to finish and update media list
    Promise.all(commands).then(() => {
      this._updateMediaListShown();
    });
  }

  // Recursively browse for media in directory specified by media_content_id
  // and write results into this.mediaList.
  private _fillMediaList(commands: Promise<void>[], media_content_id: string): void {
    commands.push(
      this._hass
        .callWS({
          type: "media_source/browse_media",
          media_content_id: media_content_id,
        })
        .then((wsResponse) => {
          wsResponse.children.forEach((child: any) => {
            if (child.media_class == "directory") {
              this._fillMediaList(commands, child.media_content_id);
            } else {
              const mediaItem = {
                title: child.title,
                media_content_type: child.media_content_type,
                media_content_id: child.media_content_id,
                url: "",
              };
              this.mediaList.push(mediaItem);
              if (this.isDebugMode) {
                console.log("Browse media result:", child);
              }
            }
          });
        })
        .catch((err) => {
          console.error("Filling media list failed:", err.message);
        })
    );
  }

  // Update the list of media shown depending on selected page.
  private _updateMediaListShown(): void {
    const startPos = (this.currentPage - 1) * this.pageSize;
    this.maxPage = Math.ceil(this.mediaList.length / this.pageSize);
    var shownSize = this.pageSize;
    if (this.mediaList.length == 0) {
      shownSize = 0;
    } else if (this.maxPage == this.currentPage) {
      const remaining = this.mediaList.length % this.pageSize;
      shownSize = remaining > 0 ? remaining : this.pageSize;
    }
    this.maxPage == this.currentPage
      ? this.mediaList.length % this.pageSize
      : this.pageSize;
    this.mediaListShown = this.mediaList.slice(startPos, startPos + shownSize);
    if (this.mediaListShown.length > 0 && !this.mediaItemShown) {
      this.mediaItemShown = this.mediaListShown[0];
    }
  }

  // Renders a single media item as HTML and resolves media URL from HA
  // (including authentication) if no URL was contained in the media item
  // before.
  private _renderMediaItem(mediaItem: MediaItem, styleClass: string): TemplateResult {
    // Fill URL for web access if empty
    if (mediaItem.url === "") {
      this._hass
        .callWS({
          type: "media_source/resolve_media",
          media_content_id: mediaItem.media_content_id,
          expires: 60 * 60 * 3,
        })
        .then((wsResponse) => {
          mediaItem.url = wsResponse.url;
          if (this.isDebugMode) {
            console.log("Resolve media result:", wsResponse);
          }
          this.requestUpdate();
        })
        .catch((err) => {
          console.error(
            "Redering media item '" + mediaItem.title + "' failed:",
            err.message
          );
        });
    }

    // Render Media
    return html`
      <div class="imageContainer">
        ${mediaItem.media_content_type.startsWith("image")
        ? html`
              <img src="${mediaItem.url}" class="${styleClass}" loading="lazy" />
              ${styleClass === "mediaDisplay"
            ? html` <div class="imageOverlay">
                    <a href="${mediaItem.url}" target="_blank">
                      <ha-icon
                        icon="mdi:fullscreen"
                        class="navigation"
                      ></ha-icon>
                    </a>
                  </div>`
            : html``}
            `
        : mediaItem.media_content_type.startsWith("video")
          ? html`
              <video
                src="${mediaItem.url}"
                ?controls=${styleClass === "mediaDisplay"}
                preload="metadata"
                class="${styleClass}"></video>
            `
          : html`Neither image nor video found`}
      </div>
    `;
  }

  // Reloads the list of media items from the media source
  private _reloadMedia(): void {
    this.mediaList = [];
    this.mediaListShown = [];
    this.mediaItemShown = undefined;
    this.currentPage = 1;
    this.mediaListDelete = [];
    this.confirmDelete = false;
    this._loadResources();
    this.requestUpdate();
  }

  // Selects all media
  private _selectAllMedia(): void {
    this.mediaListDelete = [...this.mediaList];
    this.requestUpdate();
  }


  // Deselects all media
  private _deselectAllMedia(): void {
    this.mediaListDelete = [];
    this.requestUpdate();
  }

  // Deletes the selected media from media source
  private async _deleteMedia(): Promise<void> {
    const commands = this.mediaListDelete.map(mediaItem => {
      const file = mediaItem.media_content_id.replace('media-source://media_source/local', '/media');
      return this._hass.callService('delete', 'file', { file });
    });

    await Promise.all(commands);
    this.mediaList = [];
    this.mediaItemShown = undefined;
    this.currentPage = 1;
    this.mediaListDelete = [];
    this.confirmDelete = false;
    await this._loadResources();
    this.requestUpdate();
  }

  // Sets the current page shown from the media list
  private _setPage(page: number): void {
    if (page >= 1 && page <= this.maxPage) {
      this.currentPage = page;
      this._updateMediaListShown();
    }
  }

  // Sets the current media item shown in large box
  private _setMedia(mediaItem: MediaItem): void {
    this.mediaItemShown = mediaItem;
    this.requestUpdate();
  }

  // Adds a media item to be deleted
  private _addMediaToDelete(mediaItem: MediaItem): void {
    this.mediaListDelete.push(mediaItem);
    this.requestUpdate();
  }

  // Removes a media item from the list to be deleted
  private _removeMediaToDelete(mediaItem: MediaItem): void {
    this.mediaListDelete = this.mediaListDelete.filter(m => m !== mediaItem);
    this.requestUpdate();
  }
}