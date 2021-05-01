/*
 useHttpQueue.js - ESP3D WebUI hooks file

 Copyright (c) 2021 Alexandre Aussourd. All rights reserved.
 Modified by Luc LEBOSSE 2021
 
 This code is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.
 This code is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.
 You should have received a copy of the GNU Lesser General Public
 License along with This code; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import { useHttpQueueContext, useUiContext } from "../contexts";
import { generateUID } from "../components/Helpers";

/*
 * Local const
 *
 */
const useHttpQueue = () => {
  const {
    addInQueue,
    addInTopQueue,
    removeRequests,
    getCurrentRequest,
    processRequests,
  } = useHttpQueueContext();
  const [data, setData] = useState();
  const [killOnUnmount, setKillOnUnmount] = useState(true);
  const _localRequests = useRef([]);

  useEffect(() => {
    // return () => killOnUnmount && removeRequests(_localRequests.current);
  }, []);

  const createNewTopRequest = (url, params, callbacks = {}) => {
    const {
      onSuccess: onSuccessCb,
      onFail: onFailCb,
      onProgress: onProgressCb,
    } = callbacks;
    const id = params.id ? params.id : generateUID();
    _localRequests.current = [..._localRequests.current, id];
    addInTopQueue({
      id,
      url,
      params,
      onSuccess: (result) => {
        setData(result);
        if (onSuccessCb) onSuccessCb(result);
      },
      onProgress: (e) => {
        onProgressCb(e);
      },
      onFail: onFailCb
        ? (error) => {
            onFailCb(error);
          }
        : null,
    });
  };

  const createNewRequest = (url, params, callbacks = {}) => {
    const {
      onSuccess: onSuccessCb,
      onFail: onFailCb,
      onProgress: onProgressCb,
    } = callbacks;
    const id = params.id ? params.id : generateUID();
    //TODO: reject if has params maxid and number inside is already over
    _localRequests.current = [..._localRequests.current, id];
    addInQueue({
      id,
      url,
      params,
      onSuccess: (result) => {
        setData(result);
        if (onSuccessCb) onSuccessCb(result);
      },
      onProgress: (e) => {
        onProgressCb(e);
      },
      onFail: onFailCb
        ? (error) => {
            onFailCb(error);
          }
        : null,
    });
  };

  const abortRequest = (id) => {
    if (id) {
      removeRequests(id);
    }
    const currentRequest = getCurrentRequest();
    if (currentRequest) {
      currentRequest.abort();
    } else {
      // Toaster no current request
    }
  };

  const processRequestsNow = () => {
    processRequests();
  };

  return {
    data,
    setData,
    createNewRequest,
    processRequestsNow,
    createNewTopRequest,
    abortRequest,
    setKillOnUnmount,
  };
};

export { useHttpQueue };
