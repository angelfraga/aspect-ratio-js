export interface Ratio {
  numerator: number;
  denominator: number;
}

export type RatioType = Ratio | string;
export type AspectRatioAlignType =
  | "center"
  | "center center"
  | "center top"
  | "center bottom";

export interface AspectRationOptions {
  /**
   * @description element which defines boundaries of the
   * element to be aspect-ratio forced.
   */
  container: HTMLElement;
  /**
   * @description element which contains the content to be
   * aspect ratio forced & which size will be modified by AspectRatio
   */
  mask: HTMLElement;
  /**
   * @description min width to be used for aspect _aspectRatio
   * calculation
   */
  minWidth?: number;
  /**
   * @description min height to be used for aspect _aspectRatio
   * calculation
   */
  minHeight?: number;
  /**
   * @description string separated by slash or colons
   * or Ratio Object.
   * @example
   *  valid string values '16/9' or '16:9'
   *  valid ratio object value
   *  {
   *   numerator: 16,
   *   denominator: 9
   *  }
   */
  ratio: RatioType;
  align: AspectRatioAlignType;
}

export class AspectRatio {
  private sizer = window.document.createElement("div") as HTMLDivElement;
  private style = window.document.createElement("style") as HTMLStyleElement;
  private iframe = window.document.createElement("iframe") as HTMLIFrameElement;
  private options: AspectRationOptions;

  set minWidth(minWidth: number) {
    this.iframe.setAttribute("width", minWidth.toString());
  }

  set minHeight(minHeight: number) {
    this.iframe.setAttribute("height", minHeight.toString());
  }

  set ratio(ratio: RatioType) {
    if (!ratio) {
      console.error("No ratio provided.", { ratio });
      return;
    }

    if (typeof ratio === "string") {
      this.updateRatioFromString(ratio);
    }

    if (typeof ratio === "object") {
      this.updateRatioFromRatio(ratio);
    }

    this.updateStyle();
  }

  set mask(mask: HTMLElement) {
    if (mask) {
      this.options.mask = mask;
    } else {
      console.error("No mask element provider.", { mask });
    }
  }

  constructor(options: AspectRationOptions) {
    const { container, mask, ratio } = options || {};
    if (container || mask) {
      this.options = options;
      this.iframe.classList.add("aspect-ratio-iframe");
      container.classList.add("aspect-ratio-container");
      mask.classList.add("aspect-ratio-mask");
      // attach iframe
      container.prepend(this.iframe);
      // add style
      this.iframe.contentDocument.body.appendChild(this.style);
      // add the sizer div
      this.iframe.contentDocument.body.appendChild(this.sizer);
      // add resize listerner
      this.iframe.contentWindow.addEventListener("resize", () =>
        this.resizeMask()
      );
      this.ratio = ratio;
    } else {
      console.error("No container or mask is being passed for aspect-ratio.", {
        options
      });
    }
  }

  destroy() {
    this.style = undefined;
    this.sizer = undefined;
    this.iframe.parentNode.removeChild(this.iframe);
    this.iframe = undefined;
    this.options = undefined;
  }

  updateStyle() {
    const { ratio, align } = this.options;
    const { numerator, denominator } = ratio as Ratio;
    this.sizer.setAttribute("data-align", align);
    this.style.textContent = `
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
      }
      div {
        margin: auto;
        position: absolute;
        --numerator: ${numerator};
        --denominator: ${denominator};
        max-width: 100%;
        max-height: 100%;
        height: calc(1vw * var(--denominator) / var(--numerator) * 100);
        width: calc(1vh * var(--numerator) / var(--denominator) * 100);
      }

      div[data-align="center center"] {
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }
      div[data-align="center"] {
        left: 0;
        right: 0;
      }
      div[data-align="center top"] {
        left: 0;
        right: 0;
        top: 0;
      }
      div[data-align="center bottom"] {
        left: 0;
        right: 0;
        bottom: 0;
      }
    `;
    this.resizeMask();
  }

  resizeMask() {
    const coords = this.sizer.getBoundingClientRect();
    const { mask } = this.options;
    mask.style.width = coords.width + "px";
    mask.style.height = coords.height + "px";
    mask.style.top = coords.top + "px";
    mask.style.bottom = coords.bottom + "px";
    mask.style.left = coords.left + "px";
    mask.style.right = coords.right + "px";
  }

  private updateRatioFromString(ratioStr: string) {
    const [numeratorStr, denominatorStr] = (ratioStr || "16/9").split("/");
    const numerator = parseInt(numeratorStr, 10);
    const denominator = parseInt(denominatorStr, 10);
    const ratio: Ratio = { denominator, numerator };

    if (!this.isValidRatio(ratio)) return;

    this.options = {
      ...this.options,
      ratio
    };
  }

  private updateRatioFromRatio(ratio: Ratio) {
    if (!this.isValidRatio(ratio)) return;

    this.options = {
      ...this.options,
      ratio
    };
  }

  private isValidRatio({ numerator, denominator }: Ratio): boolean {
    const isBiggerThan0 = n => n > 0;
    return isBiggerThan0(numerator) && isBiggerThan0(denominator);
  }
}
