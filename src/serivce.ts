import Axios, { AxiosPromise } from 'axios';

type FetchTokenResponse = {
  token: string;
  status: 'ok'| 'error';
  code: number;
  message?: string;
}

const HOST = 'https://www2.hs-esslingen.de/~melcher/internet-technologien/minesweeper/'

export const fetchToken = async (size: number, mines: number): Promise<string> => {
  try {
    const params = {
      request: 'init',
      userid: 'jhjhit00',
      size,
      mines,
    }

    const { data, status } = await Axios.get<FetchTokenResponse>(HOST, { params })
    console.log('response status is: ', status);
    return data.token;
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

type EmptyCell = {
  x: number,
  y: number,
  minesAround: number,
  isOpen: boolean
}

type Point ={
  x: number;
  y: number
}

export type SweepResponse = {
  userwins: boolean;
  minehit?: boolean;
  minesAround: number;
  emptyCells: EmptyCell[];
  mines?:  Point[];
  status: 'ok'| 'error';
  code: number;
  message?: string;
}

export const sweep = (token: string, x: number, y: number): AxiosPromise<SweepResponse> => {
  const params = {
    request: 'sweep',
    token,
    x,
    y
  }

  return Axios.get<SweepResponse>(HOST, { params })

}
