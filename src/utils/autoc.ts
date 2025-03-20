import { AppRequest } from "@/api/record";

export const acInput = (key: string, cb: any, type: string) => {
  if (key.length < 2) return;
  let timeout: ReturnType<typeof setTimeout>;
  const _request = new AppRequest(type);
  _request.appRequest("ac", {}, key).then(({ data }) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(data);
    }, 500 * Math.random());
  });
};
