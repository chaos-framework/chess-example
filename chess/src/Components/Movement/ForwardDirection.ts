import { Component, Team, Vector } from "@chaos-framework/core";

export default class ForwardDirection extends Component<Team> {
  name = "Team Direction"
  public = false;

  constructor(public direction: Vector) {
    super();
  }
}