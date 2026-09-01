/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { useEffect, useState } from "react";
import aemHeadlessClient from "./aemHeadlessClient";

// environment variable for configuring the headless client
const { DISABLE_CACHE, REACT_APP_GRAPHQL_ENDPOINT} = process.env;

/**
 * This file contains the React useEffect custom hooks that:
 * 1. Are called by the React components
 * 2. To get data from AEM GraphQL persisted queries
 *
 * Each custom hook maps to a persisted query and is responsible for:
 * 1. Calling the AEM persisted query
 * 2. Collecting and transforming the returned data into the format expected by the React view components
 * 3. Setting and returning any error state
 */

/**
 * Private, shared function that invokes the AEM Headless client.
 * 
 * @param {String} persistedQueryName the fully qualified name of the persisted query
 * @param {*} queryParameters an optional JavaScript object containing query parameters
 * @returns the GraphQL data or an error message 
 */
async function fetchPersistedQuery(persistedQueryName, queryParameters) {
  let data;
  let err;

  // Do NOT disable cache in production. This toggle is this demo app is only to help you quickly explore AEM's Headless APIs without having to wait for cache expiration to see changes.
  if (DISABLE_CACHE === "true") {
    if (queryParameters === "undefined") {
      queryParameters = {};
    }
    queryParameters.timestamp = new Date().getTime();
  }

  try {
    // AEM GraphQL queries are asynchronous, either await their return or use Promise-based .then(..) { ... } syntax
    const response = await aemHeadlessClient.runPersistedQuery(
      persistedQueryName,
      queryParameters
    );
    // The GraphQL data is stored on the response's data field
    data = response?.data;
  } catch (e) {
    // An error occurred, return the error messages
    err = e
      .toJSON()
      ?.map((error) => error.message)
      ?.join(", ");
    console.error(e.toJSON());
  }

  return { data, err };
}

/**
 * React custom hook that returns the full list of destinations.
 *
 * Calls the '[graphql endpoint namespace]/destinations-all' persisted query.
 *
 * @returns an array of Destination JSON objects, and any errors
 */
export function useDestinations(params) {
  const [destinations, setDestinations] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Call the AEM GraphQL persisted query named "[graphql endpoint namespace]/destinations-all"
      const response = await fetchPersistedQuery(REACT_APP_GRAPHQL_ENDPOINT + "/destinations-all", params);

      // Set the destinations to the list of destination JSON objects
      setDestinations(response.data?.destinationsList?.items);

      // Set any errors
      setErrors(response.err);
    }
    // Call the internal fetchData() as per React best practices
    fetchData();

  }, [params]);

  // Returns the destinations and errors
  return { destinations, errors };
}

/**
 * Calls the '[graphql endpoint namespace]/destination-by-path' persisted query with a `destinationPath` parameter.
 *
 * @param {String!} destinationPath the destination content-fragment path
 * @param {Object} params optional image-transform parameters (imageFormat, imageSeoName, imageWidth, imageQuality)
 * @returns a JSON object representing the Destination
 */
export function useDestinationByPath(destinationPath, params) {
  const [destination, setDestination] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // The key is 'destinationPath' as defined in the persisted query
      const queryVariables = {
        ...params,
        destinationPath,
      };

      // Call the AEM GraphQL persisted query named "[graphql endpoint namespace]/destination-by-path" with parameters
      const response = await fetchPersistedQuery(
        REACT_APP_GRAPHQL_ENDPOINT + "/destination-by-path",
        queryVariables
      );

      if (response.err) {
        // Capture errors from the HTTP request
        setErrors(response.err);
      } else if (response.data?.destinationsByPath?.item) {
        // Set the Destination data after data validation
        setDestination(response.data.destinationsByPath.item);
      } else {
        // Set an error if no Destination could be found
        setErrors(`Cannot find Destination at path: ${destinationPath}`);
      }
    }

    // Call the internal fetchData() as per React best practices
    fetchData();

  }, [destinationPath, params]);

  return { destination, errors };
}


