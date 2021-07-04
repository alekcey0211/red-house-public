import * as React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { KeyBoard } from "../../utils";
type Key = {
  [key: string]: () => {};
};

interface Params {
  name: string;
  show: boolean;
  children: React.Component;
  hotKeys: Key;
}

const KeyBoardLayout = ({ show = true, hotKeys, children, name }: Params) => {
  const state = useSelector((state) => state);
  // @ts-ignore
  const isOpen = state.appReducer.usableUi.includes(name);
  useEffect(() => {
    const newKeyBoard = new KeyBoard(hotKeys);
    if (isOpen && show) {
      newKeyBoard.init(hotKeys);
      return () => {
        newKeyBoard.remove(hotKeys);
      };
    }
  }, [name, isOpen]);
  return show && isOpen && <>{children}</>;
};

export default KeyBoardLayout;
