/*
 logo.js - Marlin logo file

 Copyright (c) 2020 Luc Lebosse. All rights reserved.

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
import { useSettingsContext } from "../../../contexts/SettingsContext";

/*
 *ESP3D Logo
 * default height is 50px
 */
const AppLogo = ({
  height = "50px",
  color = "currentColor",
  bgcolor = "white",
}) => {
  const { interfaceSettings } = useSettingsContext();
  if (
    interfaceSettings.current &&
    interfaceSettings.custom &&
    interfaceSettings.custom.logo
  )
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: interfaceSettings.custom.logo
            .replace("{height}", height)
            .replaceAll("{color}", color)
            .replaceAll("{bgcolor}", bgcolor),
        }}
      ></span>
    );
  else
    return (
      <svg
        height={height}
        viewBox="100 290 410 200"
        enable-background="new 0 0 595.28 841.89"
        class="esp3dlogo"
      >
        <path
          fill={color}
          stroke={color}
          d="M428.064,394.44v20.351h-13.682v-45.299h-15.177v45.299v13.911h15.177h13.682h15.176v-13.911v-20.694
	c0-6.669,4.828-11.268,11.496-11.268c10.004,0,11.152,7.933,11.152,11.268v34.605c4.027,0,8.057,0,12.084,0
	c1.523,0.034,3.094-0.854,3.094-4.092v-30.17c0-15.521-9.773-26.443-26.33-26.443C438.641,367.997,428.064,379.379,428.064,394.44
	L428.064,394.44z M312.145,428.702h-12.301h-15.177v-14.716v-14.717c0-9.083-6.783-16.556-15.176-16.556
	c-8.393,0-15.176,7.243-15.176,16.096c0,8.738,6.783,15.177,15.521,15.177h8.738v14.716h-10.578
	c-16.556,0-28.973-13.337-28.973-29.893c0-16.786,12.532-30.812,30.467-30.812c17.821,0,30.353,14.026,30.353,31.272v14.717h12.301
	V394.44c0-15.061,10.578-26.443,26.674-26.443c16.557,0,26.328,10.922,26.328,26.443v2.645h-15.176v-2.988
	c0-3.335-1.15-11.268-11.152-11.268c-6.668,0-11.497,4.599-11.497,11.268v19.89v14.716H312.145L312.145,428.702z M235.622,375.7
	c0-15.981-11.842-28.743-28.973-28.743c-8.738,0-16.441,4.023-21.27,10.348c-4.943-6.324-12.417-10.348-21.269-10.348
	c-17.016,0-28.858,12.762-28.858,28.743c0,16.766,0,33.532,0,50.297c0,1.439,1.1,2.704,2.815,2.704h12.246V375.47
	c0-7.588,5.403-13.682,13.797-13.682c8.277,0,13.681,6.094,13.681,13.682v53.231h15.292V375.47c0-7.588,5.173-13.682,13.566-13.682
	c8.278,0,13.796,6.094,13.796,13.682v53.231h15.176V375.7L235.622,375.7z M368.676,403.868c0,16.212,9.197,26.559,26.559,24.719
	v-13.796c-7.474,0.46-11.268-2.529-11.268-10.923v-60.704h-15.291V403.868L368.676,403.868z M414.383,363.053v-8.508
	c0-4.254-3.449-7.588-7.588-7.588c-4.254,0-7.703,3.334-7.703,7.588v8.508H414.383L414.383,363.053z"
        />
        <path
          fill="none"
          stroke={color}
          stroke-width="7.0866"
          stroke-miterlimit="22.9256"
          d="M140.005,322.083h336.307
	c15.59,0,28.346,12.756,28.346,28.346v69.308c0,15.591-12.756,28.346-28.346,28.346H140.005c-15.59,0-28.346-12.755-28.346-28.346
	V350.43C111.659,334.839,124.415,322.083,140.005,322.083L140.005,322.083z"
        />
        <polygon
          fill={color}
          stroke={color}
          fill-rule="evenodd"
          clip-rule="evenodd"
          points="508.164,318.522 432.027,318.522 508.164,395.771 508.164,318.522 "
        />
      </svg>
    );
};

export { AppLogo };
