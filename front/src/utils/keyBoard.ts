let keyBoardInstance = null;
let instanceArr = [];
type keyProp = {
  [key: string]: () => string | any;
};

type hotKeysProps = {
  [key in "other" | "open" | "close"]: keyProp;
};

const dispatchData = (data, type) => {
  window.storage.dispatch({
    type,
    data,
  });
};

class KeyBoard {
  hotKeys: hotKeysProps;

  constructor(hotKeys) {
    if (!keyBoardInstance) {
      keyBoardInstance = this;
    }

    this.hotKeys = hotKeys;
    return keyBoardInstance;
  }

  handle = ({ code, target }) => {
    const access =
      !["text", "textarea"].includes(target.type) &&
      !target.className.includes("binding");

    if (access) {
      const openComponentName = this.hotKeys.open?.[code]?.();
      const closeComponentName = this.hotKeys.close?.[code]?.();
      const otherFun = this.hotKeys.other?.[code];

      console.log(`PRESSED: ${code}`);

      if (openComponentName) {
        dispatchData(openComponentName, "SHOW_COMPONENT");
      } else if (closeComponentName) {
        dispatchData(closeComponentName, "HIDE_COMPONENT");
      } else if (otherFun) {
        otherFun();
      }
    }
  };

  init = (newHotKeys) => {
    document.addEventListener("keydown", this.handle);
    this.hotKeys = newHotKeys;
    instanceArr.push(this.hotKeys);
  };

  remove = () => {
    instanceArr.pop();
    if (instanceArr.length > 0) {
      this.hotKeys = instanceArr[instanceArr.length - 1];
    } else {
      keyBoardInstance = null;
      document.removeEventListener("keydown", this.handle);
    }
  };
}

export default KeyBoard;
