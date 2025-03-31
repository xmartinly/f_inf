// export const App_Request = new AppRequest();
const local = "http://127.0.0.1:8000/api/";
const remote = "https://order-api.infcd.com/api/";
const is_dev = false;

export const baseUrlApi = (url: string) => {
  return is_dev ? `${local}${url}` : `${remote}${url}`;
};
