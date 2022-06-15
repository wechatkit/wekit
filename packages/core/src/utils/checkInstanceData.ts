export function checkInstanceData(ctx: any, options: any) {
  if (ctx.data !== options.data) {
    Object.defineProperty(ctx, "data", {
      get() {
        return ctx.__data__;
      },
    });
  }
}
