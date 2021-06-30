import axios from "axios";
import { AxiosInstance } from "axios"
import { Injectable } from '@angular/core';
import { ErrorHandler } from "@angular/core";


export interface ErrorResponse {
	id: string;
	code: string;
	message: string;
}

@Injectable({
  providedIn: 'root'
})

export class ApiClient {
  /**
   * Create an axios instance
   */
  axiosClient: AxiosInstance;
	errorHandler: ErrorHandler;

  constructor(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler;

		// The ApiClient wraps calls to the underlying Axios client.
		this.axiosClient = axios.create({
			timeout: 3000,
			headers: {
				"X-Initialized-At": Date.now().toString()
			}
		});
  }

  normalizeError( error: any ) : ErrorResponse {
		this.errorHandler.handleError( error );
		return({
			id: "-1",
			code: "UnknownError",
			message: "An unexpected error occurred."
		});
	}
}
