/*
 index.js - ESP3D WebUI helpers file

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
import { espHttpURL, getCookie, isLimitedEnvironment } from "./http";
import { getBrowserTime } from "./time";
import {
  createComponent,
  disableNode,
  disableUI,
  generateUID,
  getColClasses,
} from "./components";
import {
  beautifyJSONString,
  capitalize,
  hslToHex,
  formatFileSizeToString,
  formatStatus,
  compareStrings,
  replaceVariables,
} from "./strings";
import {
  limitArr,
  mergeJSON,
  removeEntriesByIDs,
  splitArrayByLines,
} from "./arrays";
import { dispatchToExtensions } from "./html";
import { sortedFilesList, filterResultFiles } from "./filters";

export {
  beautifyJSONString,
  capitalize,
  replaceVariables,
  compareStrings,
  createComponent,
  disableNode,
  disableUI,
  dispatchToExtensions,
  espHttpURL,
  filterResultFiles,
  formatStatus,
  generateUID,
  getBrowserTime,
  getColClasses,
  getCookie,
  hslToHex,
  isLimitedEnvironment,
  limitArr,
  mergeJSON,
  formatFileSizeToString,
  removeEntriesByIDs,
  sortedFilesList,
  splitArrayByLines,
};
