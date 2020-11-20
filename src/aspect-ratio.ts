export interface Ratio {
  numerator: number;
  denominator: number;
}

export type RatioType = Ratio | string;

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
}

export class AspectRatio {
  private sizer = window.document.createElement("div") as HTMLDivElement;
  private style = window.document.createElement("style") as HTMLStyleElement;
  private iframe = window.document.createElement("iframe") as HTMLIFrameElement;
  private _mask: HTMLElement;
  private onResize = function() {};
  private options: AspectRationOptions;

  set minWidth(minWidth: number) {
    this.iframe.setAttribute("width", minWidth.toString());
  }

  set minHeight(minHeight: number) {
    this.iframe.setAttribute("height", minHeight.toString());
  }

  private set denominator(denominator: number) {
    this.updateStyle();
    this.resizeMask();
  }

  private set numerator(numerator: number) {
    this.updateStyle();
    this.resizeMask();
  }

  set ratio(ratio: RatioType) {
    if (!ratio) {
      console.error("No ratio provided.", { ratio });
      return;
    }

    if (typeof ratio === "string") {
      this.updateRatioFromString(ratio);
    }

    if (typeof ratio) {
      this.updateRatioFromRatio(ratio);
    }
  }

  set mask(mask: HTMLElement) {
    if (mask) {
      this.options.mask = mask;
    } else {
      console.error("No mask element provider.", { mask });
    }
  }

  constructor(options: AspectRationOptions) {
    const { container, mask } = options || {};
    if (container || mask) {
      this.options = options;
      // attach iframe
      container.prepend(this.iframe);
      // add style
      this.iframe.contentDocument.body.appendChild(this.style);
      // add the sizer div
      this.iframe.contentDocument.body.appendChild(this.sizer);
      // add resize listerner
      this.iframe.contentWindow.addEventListener("resize", () =>
        this.onResize()
      );
    } else {
      console.error("No container or mask is being passed for aspect-ratio.", {
        options
      });
    }
  }

  destroy() {
    this.iframe.contentWindow.removeAllListeners();
  }

  updateStyle() {
    this.style.textContent = `
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
      }
      div {
        margin: auto;
        position: absolute;
        --numerator: ${this.numerator};
        --denominator: ${this.denominator};
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
  }

  resizeMask() {
    const coords = this.sizer.getBoundingClientRect();
    this._mask.style.width = coords.width + "px";
    this._mask.style.height = coords.height + "px";
    this._mask.style.top = coords.top + "px";
    this._mask.style.bottom = coords.bottom + "px";
    this._mask.style.left = coords.left + "px";
    this._mask.style.right = coords.right + "px";
  }

  private updateRatioFromString(ratio: string) {
    const [numeratorStr, denominatorStr] = (ratio || "16/9").split("/");
    const numerator = parseInt(numeratorStr, 10);
    const denominator = parseInt(denominatorStr, 10);
    this.options = {
      ...this.options,
      ratio: {
        numerator,
        denominator
      }
    };
  }

  private updateRatioFromRatio(ratio: Ratio) {
    const { numerator, denominator } = ratio;

    this.options = {
      ...this.options,
      ratio: {
        numerator,
        denominator
      }
    };
  }

  private isValidRatio(numerator: number, denominator: number): boolean {
    const isBiggerThan0 = n => n > 0;
    return isBiggerThan0(numerator) && isBiggerThan0(denominator);
  }
}
