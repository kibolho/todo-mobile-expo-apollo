import { AxiosHttpClient } from "@/infra/http";
import { mockAxios, mockHttpResponse } from "@/tests/infra/mocks";
import { mockHttpRequest } from "@/tests/data/mocks";

import axios from "axios";

jest.mock("axios");

type SutTypes = {
  sut: AxiosHttpClient;
  mockedAxios: jest.Mocked<typeof axios>;
};

const makeSut = (response?: any): SutTypes => {
  const sut = new AxiosHttpClient();
  const mockedAxios = mockAxios(response);
  return {
    sut,
    mockedAxios,
  };
};

describe("AxiosHttpClient", () => {
  test("Should call axios with correct values", async () => {
    const request = mockHttpRequest();
    const { sut, mockedAxios } = makeSut();

    await sut.request(request);

    expect(mockedAxios.request).toHaveBeenCalledWith({
      url: request.url,
      data: request.body,
      headers: request.headers,
      method: request.method,
    });
  });

  test("Should return correct response", async () => {
    const { sut, mockedAxios } = makeSut();

    const httpResponse = await sut.request(mockHttpRequest());
    const axiosResponse = await mockedAxios.request.mock.results[0].value;

    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    });
  });

  test("Should return correct error", () => {
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockRejectedValueOnce({
      response: mockHttpResponse(),
    });

    const promise = sut.request(mockHttpRequest());

    expect(promise).toEqual(mockedAxios.request.mock.results[0].value);
  });

  test("Should return a unknown error", async () => {
    const { sut } = makeSut(null);

    const httpResponse = await sut.request(mockHttpRequest());

    expect(httpResponse).toEqual({
      body: null,
      statusCode: 400,
    });
  });
});
