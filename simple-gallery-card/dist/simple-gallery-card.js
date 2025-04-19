import { css, LitElement, html } from "https://unpkg.com/lit-element@3.3.0/lit-element.js?module";
const styles = css`
  .displayBox {
    width: 100%;
    text-align: center;
  }

  .selectBox td {
    font-size: 75%;
    vertical-align: top;
  }

  .pagesBox {
    font-size: 125%;
    margin: 8px;
  }

  .pageNumber {
    cursor: pointer;
    display: inline-block;
    width: 35px;
    margin: 2px;
    text-align: center;
    background-color: DimGray;
  }

  img {
    display: block;
  }

  video {
    display: block;
  }

  .mediaDisplay {
    width: 100%;
  }

  .mediaPreview {
    height: 100px;
    cursor: pointer;
  }

  .transparent {
    opacity: 0.5;
  }

  .navigation {
    padding: 3px;
    margin: 2px;
    cursor: pointer;
  }

  .imageContainer {
    position: relative;
  }

  .imageOverlay {
    position: absolute;
    bottom: 8px;
    right: 16px;
    background-color: rgba(0, 0, 0, 0.2);
  }

  a:link,
  a:visited,
  a:hover,
  a:active {
    color: white;
  }
`;
class SimpleGalleryCard extends LitElement {
  // Define custom properties, which cause card re-rendering
  static get properties() {
    return {
      _hass: {},
      config: {},
      mediaList: [],
      mediaListShown: {},
      mediaListDelete: {},
      mediaItemShown: {},
      currentPage: {},
      pageSize: {},
      maxPage: {},
      confirmDelete: {},
      hasDelete: {},
      isDebugMode: {}
    };
  }
  // Define default values for custom properties
  constructor() {
    super();
    this.mediaList = void 0;
    this.mediaListShown = [];
    this.mediaListDelete = [];
    this.mediaItemShown = void 0;
    this.currentPage = 1;
    this.pageSize = 4;
    this.maxPage = 1;
    this.confirmDelete = false;
    this.hasDelete = false;
    const urlParams = new URLSearchParams(window.location.search);
    this.isDebugMode = urlParams.has("debug") && urlParams.get("debug") === "1";
  }
  // Load custom styles to card
  static get styles() {
    return styles;
  }
  // Render card
  render() {
    const title = this.config.title ? this.config.title : "";
    this._updateMediaListShown();
    return html` <ha-card header="${title}">
      <div class="displayBox">
        ${this.mediaItemShown ? html`
              ${this._renderMediaItem(this.mediaItemShown, "mediaDisplay")}
              ${this.mediaItemShown.title}
            ` : html`No media to display`}
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
          class="navigation ${this.currentPage == this.maxPage ? "transparent" : ""}"
        ></ha-icon>
        <ha-icon
          @click="${this._reloadMedia}"
          icon="mdi:reload"
          class="navigation"
        ></ha-icon>
        ${this.hasDelete ? html`
              ${this.mediaListDelete.length == this.mediaList.length ? html`<ha-icon
                    @click="${this._deselectAllMedia}"
                    icon="mdi:cancel"
                    class="navigation"
                  ></ha-icon>` : html`<ha-icon
                    @click="${this._selectAllMedia}"
                    icon="mdi:select-all"
                    class="navigation"
                  ></ha-icon>`}
            ` : html``}
        <span style="float:right">
          ${this.mediaListDelete.length > 0 && this.hasDelete ? html`
                ${this.mediaListDelete.length}
                <ha-icon
                  @click="${() => this.confirmDelete = true}"
                  icon="mdi:delete"
                  class="navigation"
                ></ha-icon>
              ` : ``}
          ${this.confirmDelete && this.hasDelete ? html`
                <ha-icon
                  @click="${this._deleteMedia}"
                  icon="mdi:check-bold"
                  class="navigation"
                ></ha-icon>
                <ha-icon
                  @click="${() => this.confirmDelete = false}"
                  icon="mdi:close-thick"
                  class="navigation"
                ></ha-icon>
              ` : ``}
        </span>
      </div>
      <div class="pagesBox">
        ${Array(this.maxPage).fill().map(
      (v, i) => html`<span
                @click="${() => this._setPage(i + 1)}"
                class="pageNumber"
                style="${this.currentPage == i + 1 ? css`
                      text-decoration:underline
                    ` : ``}"
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
                ${this.hasDelete ? html`
                      <br />
                      ${this.mediaListDelete.includes(mediaItem) ? html` <ha-icon
                            @click="${() => this._removeMediaToDelete(mediaItem)}"
                            icon="mdi:delete-restore"
                            class="navigation"
                          ></ha-icon>` : html`
                            <ha-icon
                              @click="${() => this._addMediaToDelete(mediaItem)}"
                              icon="mdi:delete-outline"
                              class="navigation"
                            ></ha-icon>
                          `}
                    ` : html``}
              </td>
            </tr>
          `
    )}
      </table>
    </ha-card>`;
  }
  setConfig(config) {
    if (!config.media_content_id) {
      throw new Error(
        "You must define a media content id, which defines a directory. Example: 'media-source://media_source/local/myfolder/', which refers to folder named 'myfolder' in your local media folder."
      );
    }
    this.config = config;
  }
  set hass(hass) {
    this._hass = hass;
    this._loadResources();
  }
  getCardSize() {
    return 5;
  }
  // Loads all resources required; i.e., fills the media list and updates
  // list of media shown depending on selected page.
  _loadResources() {
    if (this.config.page_size) {
      this.pageSize = this.config.page_size;
    }
    if (this.mediaList != void 0) {
      return;
    }
    this.mediaList = [];
    var commands = [];
    this._fillMediaList(commands, this.config.media_content_id);
    commands.push(
      this._hass.callWS({
        type: "get_config"
      }).then((wsResponse) => {
        this.hasDelete = wsResponse.components.includes("delete");
      })
    );
    Promise.all(commands).then(() => {
      this._updateMediaListShown();
    });
  }
  // Recursively browse for media in directory specified by media_content_id
  // and write results into this.mediaList.
  _fillMediaList(commands, media_content_id) {
    commands.push(
      this._hass.callWS({
        type: "media_source/browse_media",
        media_content_id
      }).then((wsResponse) => {
        wsResponse.children.forEach((child) => {
          if (child.media_class == "directory") {
            this._fillMediaList(commands, child.media_content_id);
          } else {
            const mediaItem = {
              title: child.title,
              media_content_type: child.media_content_type,
              media_content_id: child.media_content_id,
              url: ""
            };
            this.mediaList.push(mediaItem);
            if (this.isDebugMode) {
              console.log("Browse media result:", child);
            }
          }
        });
      }).catch((err) => {
        console.error("Filling media list failed:", err.message);
      })
    );
  }
  // Update the list of media shown depending on selected page.
  _updateMediaListShown() {
    const startPos = (this.currentPage - 1) * this.pageSize;
    this.maxPage = Math.ceil(this.mediaList.length / this.pageSize);
    var shownSize = this.pageSize;
    if (this.mediaList.length == 0) {
      shownSize = 0;
    } else if (this.maxPage == this.currentPage) {
      const remaining = this.mediaList.length % this.pageSize;
      shownSize = remaining > 0 ? remaining : this.pageSize;
    }
    this.maxPage == this.currentPage ? this.mediaList.length % this.pageSize : this.pageSize;
    this.mediaListShown = this.mediaList.slice(startPos, startPos + shownSize);
    if (this.mediaListShown.length > 0 && !this.mediaItemShown) {
      this.mediaItemShown = this.mediaListShown[0];
    }
  }
  // Renders a single media item as HTML and resolves media URL from HA
  // (including authentication) if no URL was contained in the media item
  // before.
  _renderMediaItem(mediaItem, styleClass) {
    if (mediaItem.url === "") {
      this._hass.callWS({
        type: "media_source/resolve_media",
        media_content_id: mediaItem.media_content_id,
        expires: 60 * 60 * 3
      }).then((wsResponse) => {
        mediaItem.url = wsResponse.url;
        if (this.isDebugMode) {
          console.log("Resolve media result:", wsResponse);
        }
        this.requestUpdate();
      }).catch((err) => {
        console.error(
          "Redering media item '" + mediaItem.title + "' failed:",
          err.message
        );
      });
    }
    return html`
      <div class="imageContainer">
        ${mediaItem.media_content_type.startsWith("image") ? html`
              <img src="${mediaItem.url}" class="${styleClass}" />
              ${styleClass === "mediaDisplay" ? html` <div class="imageOverlay">
                    <a href="${mediaItem.url}" target="_blank">
                      <ha-icon
                        icon="mdi:fullscreen"
                        class="navigation"
                      ></ha-icon>
                    </a>
                  </div>` : html``}
            ` : mediaItem.media_content_type.startsWith("video") ? html`
              <video
                src="${mediaItem.url}#t=0.5"
                ?controls=${styleClass === "mediaDisplay"}
                preload="metadata"
                class="${styleClass}"></video>
            ` : html`Neither image nor video found`}
      </div>
    `;
  }
  // Reloads the list of media items from the media source
  _reloadMedia() {
    this.mediaList = void 0;
    this.mediaItemShown = void 0;
    this.currentPage = 1;
    this.mediaListDelete = [];
    this.confirmDelete = false;
    this._loadResources();
    this.requestUpdate();
  }
  // Selects all media
  _selectAllMedia() {
    this.mediaListDelete = [];
    this.mediaListDelete.push(...this.mediaList);
    this.requestUpdate();
  }
  // Selects all media
  _deselectAllMedia() {
    this.mediaListDelete = [];
    this.requestUpdate();
  }
  // Deletes the selected media from media source
  _deleteMedia() {
    var commands = [];
    this.mediaListDelete.forEach((mediaItem) => {
      const fileName = mediaItem.media_content_id.replace(
        "media-source://media_source/local",
        "/media"
      );
      commands.push(
        this._hass.callService("delete", "file", {
          file: fileName
        })
      );
    });
    Promise.all(commands).then(() => {
      this.mediaList = void 0;
      if (this.mediaListDelete.includes(this.mediaItemShown)) {
        this.mediaItemShown = void 0;
      }
      this.currentPage = 1;
      this.mediaListDelete = [];
      this.confirmDelete = false;
      this._loadResources();
      this.requestUpdate();
    });
  }
  // Sets the current page shown from the media list
  _setPage(value) {
    if (value >= 1 && value <= this.maxPage) {
      this.currentPage = value;
    }
  }
  // Sets the current media item shown in large box
  _setMedia(mediaItem) {
    this.mediaItemShown = mediaItem;
    this.requestUpdate();
    console.log("Media item shown", this.mediaItemShown);
  }
  // Adds a media item to be deleted
  _addMediaToDelete(mediaItem) {
    this.mediaListDelete.push(mediaItem);
    this.requestUpdate();
    console.log("Media list to delete", this.mediaListDelete);
  }
  // Removes a media item from the list to be deleted
  _removeMediaToDelete(mediaItem) {
    this.mediaListDelete = this.mediaListDelete.filter((f) => f !== mediaItem);
    this.requestUpdate();
    console.log("Media list to delete", this.mediaListDelete);
  }
}
customElements.define("simple-gallery-card", SimpleGalleryCard);
