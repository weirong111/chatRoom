import axios from "axios";
import { message } from "antd";
//生产环境地址
export const BASE_URL = "https://www.weirong111.cn:5000";
//开发环境地址
// export const BASE_URL = "http://localhost:5000";
interface ReturnData<T = any> {
  msg?: string;
  status: boolean;
  data: T;
}

export default function ajax<T>(
  url: string,
  data: { [key: string]: any } = {},
  type: string = "GET"
): Promise<ReturnData<T>> {
  return new Promise((resolve) => {
    let promise;
    if (type === "GET") {
      promise = axios.get(BASE_URL + url, {
        params: data,
      });
    } else if (type === "POST") {
      promise = axios.post(BASE_URL + url, data);
    }
    promise
      ?.then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  });
}
