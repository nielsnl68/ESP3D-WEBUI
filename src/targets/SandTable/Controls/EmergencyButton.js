/*
EmergencyButton.js - ESP3D WebUI component file

 Copyright (c) 2021 Luc LEBOSSE. All rights reserved.

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
import { AlertCircle } from "preact-feather";
import { useHttpFn } from "../../../hooks";
import { espHttpURL, replaceVariables } from "../../../components/Helpers";
import { useUiContext, useUiContextFn } from "../../../contexts";
import { T } from "../../../components/Translations";
import { ButtonImg } from "../../../components/Controls";
import realCommandsTable from "SubTargetDir/realCommandsTable";

const EmergencyButton = () => {
  const { toasts } = useUiContext();

  const { createNewRequest } = useHttpFn;
  const SendCommand = (command) => {
    createNewRequest(
      espHttpURL("command", { cmd: command }).toString(),
      {
        method: "GET",
        echo: replaceVariables(realCommandsTable, command, true),
      }, //need to see real command as it is not printable
      {
        onSuccess: (result) => {},
        onFail: (error) => {
          toasts.addToast({ content: error, type: "error" });
          console.log(error);
        },
      }
    );
  };

  return (
    <ButtonImg
      m1
      error
      rtooltip
      label={T("P15")}
      icon={<AlertCircle />}
      data-tooltip={T("P15")}
      id="btnEStop"
      onclick={(e) => {
        e.target.blur();
        const cmd = replaceVariables(
          realCommandsTable,
          useUiContextFn.getValue("emergencystop")
        ).replace(";", "\n");
        SendCommand(cmd);
      }}
    />
  );
};

export { EmergencyButton };
