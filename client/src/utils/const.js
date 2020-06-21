export const RED = "red";
export const BLUE = "blue";

export const otherTeam = (team) => {
  return team === RED ? BLUE : RED;
}