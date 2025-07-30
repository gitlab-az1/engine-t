import { choose } from "./array";


export function shortId(len: number = 0xF, special?: boolean | "underscores"): string {
  let alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321";

  if(special === "underscores") {
    alphabet += "-_";
  } else if(special) {
    alphabet += "!@#$%&*()+=[]{};\\:/?";
  }

  let res: string = "";

  do {
    for(let i = 0; i < len; i++) {
      res += choose(alphabet);
    }
  } while(res[0] === "0");

  return res;
}
