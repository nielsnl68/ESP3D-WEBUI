/*
 Button.js - ESP3D WebUI component file

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

/*
 * Local const
 *
 */
const CenterLeft = ({ bordered, children }) => {
  return (
    <center>
      <div
        class={
          bordered
            ? `${bordered == "warning" ? "bordered_warning" : "bordered "} m-2`
            : ""
        }
        style="display: inline-block;text-align: left;"
      >
        {children}
      </div>
    </center>
  );
};

export default CenterLeft;
