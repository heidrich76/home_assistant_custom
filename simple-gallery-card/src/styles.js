import { css } from "https://unpkg.com/lit-element@3.3.0/lit-element.js?module";

export const styles = css`
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