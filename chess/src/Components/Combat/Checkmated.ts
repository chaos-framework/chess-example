import { Component } from "@chaos-framework/core";
import { ChessPiece } from "../../Util/Types";

export default class Checkmated extends Component<ChessPiece> {
  name = "Checkmated";
  broadcast = true;
}
