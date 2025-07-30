enum ERROR_CODE {
  ERR_UNKNOWN_ERROR = 100,
  ERR_CAST_FAIL = 101,
  ERR_ASSERTATION_FAILED = 102,
  ERR_INVALID_TYPE = 103,
  ERR_RESOURCE_DISPOSED = 104,
}


export class RuntimeException extends Error {
  public readonly code: number;
  public override readonly name: string;
  public override readonly message: string;

  public constructor(_message?: string, code?: number | keyof typeof ERROR_CODE, public readonly context?: unknown) {
    super(_message);

    this.name = "RuntimeException";
    this.message = _message ?? "";

    if(typeof code === "number") {
      this.code = -Math.abs(code);
    } else {
      this.code = -toerrcode(code);
    }
  }
}

function toerrcode(c?: string): ERROR_CODE {
  return (
    ERROR_CODE[(c || "ERR_UNKNOWN_ERROR") as keyof typeof ERROR_CODE] ??
    ERROR_CODE.ERR_UNKNOWN_ERROR
  );
}
