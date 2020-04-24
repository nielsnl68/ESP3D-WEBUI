/*
 index.js - ESP3D WebUI settings file

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

import { h } from "preact"
import { setLang, T } from "../translations"
import { RefreshCcw, ExternalLink, Save, Globe, Download } from "preact-feather"
import { Setting, globaldispatch, Action } from "../app"
import { preferences, preferencesFileName, setPreferences } from "../uisettings"
import { setSettingPage } from "./index"
import { SendCommand, SendGetHttp, SendPostHttp } from "../http"
import { useEffect } from "preact/hooks"

import LangListRessource from "../../languages/language-list.json"

/*
 * Local variables
 *
 */
let prefs

/*
 * Apply Preferences
 */
function updateUI() {
    console.log("Update UI " + preferences.settings.language)
    let allkey = Object.keys(prefs)
    for (let p = 0; p < allkey.length; p++) {
        setState(allkey[p], "default")
    }
    loadLanguage(preferences.settings.language)
    globaldispatch({
        type: Action.renderAll,
    })
    console.log("Update UI")
}

/*
 * Load Preferences query success
 */
function loadPreferencesSuccess(responseText) {
    try {
        let pref = JSON.parse(responseText)
        console.log(pref)
        if (setPreferences(pref)) {
            prefs = JSON.parse(JSON.stringify(preferences.settings))
            updateUI()
        } else {
            globaldispatch({
                type: Action.error,
                errorcode: e,
                msg: "S21",
            })
        }
    } catch (err) {
        console.log("error")
        globaldispatch({
            type: Action.parsing_preferences_error,
            errorcode: err,
        })
    }
}

/*
 * Load Preferences query error
 */
function loadPreferencesError(errorCode, responseText) {
    console.log("no valid " + preferencesFileName + ", use default")
    globaldispatch({
        type: Action.error,
        errorcode: err,
    })
}

/*
 * Load Preferences
 */
function loadPreferences() {
    const url = "/preferences.json?" + +"?" + Date.now()
    SendGetHttp(url, loadPreferencesSuccess, loadPreferencesError)
    console.log("load preferences")
}

/*
 * Load Import File
 *
 */
function loadImportFile() {
    let importFile = document.getElementById("importPControl").files
    let reader = new FileReader()
    reader.onload = function(e) {
        var contents = e.target.result
        console.log(contents)
        try {
            let pref = JSON.parse(contents)
            if (setPreferences(pref)) {
                prefs = JSON.parse(JSON.stringify(preferences.settings))
                savePreferences()
                updateUI()
            } else {
                globaldispatch({
                    type: Action.error,
                    msg: "S21",
                })
            }
        } catch (e) {
            document.getElementById("importPControl").value = ""
            console.error("Parsing error:", e)
            globaldispatch({
                type: Action.error,
                errorcode: e,
                msg: "S21",
            })
        }
    }
    reader.readAsText(importFile[0])
    closeImport()
}

/*
 * Cancel import
 *
 */
function cancelImport() {
    globaldispatch({
        type: Action.renderAll,
    })
    console.log("stopping import")
}

/*
 * Close import
 *
 */
function closeImport() {
    document.getElementById("importPControl").value = ""
    globaldispatch({
        type: Action.renderAll,
    })
}

/*
 * Prepare Settings Import
 *
 */
function importSettings() {
    document.getElementById("importPControl").click()
    document.getElementById("importPControl").onchange = () => {
        let importFile = document.getElementById("importPControl").files
        let fileList = []
        let message = []
        fileList.push(<div>{T("S56")}</div>)
        fileList.push(<br />)
        for (let i = 0; i < importFile.length; i++) {
            fileList.push(<li>{importFile[i].name}</li>)
        }
        message.push(
            <center>
                <div style="text-align: left; display: inline-block; overflow: hidden;text-overflow: ellipsis;">
                    <ul>{fileList}</ul>
                </div>
            </center>
        )
        //todo open dialog to confirm
        globaldispatch({
            type: Action.confirmation,
            msg: message,
            nextaction: loadImportFile,
            nextaction2: closeImport,
        })
    }
}

/*
 * Saves Preferences
 */
function saveAndApply() {
    savePreferences()
}

/*
 * Upload sucess
 *
 */
function successUpload(response) {
    prefs = JSON.parse(JSON.stringify(preferences.settings))
    let allkey = Object.keys(prefs)
    for (let p = 0; p < allkey.length; p++) {
        setState(allkey[p], "success")
    }
    globaldispatch({
        type: Action.upload_progress,
        progress: 100,
    })
    globaldispatch({
        type: Action.renderAll,
    })
    console.log("success")
}

/*
 * Cancel upload silently
 * e.g: user pressed cancel before upload
 */
function cancelUpload() {
    cancelCurrentUpload()
    globaldispatch({
        type: Action.renderAll,
    })
}

/*
 * Upload failed
 *
 */
function errorUpload(errorCode, response) {
    console.log("error upload code : " + lastError.code + " " + errorCode)
    clearUploadInformation()
    if (!lastError.code && errorCode == 0) {
        cancelCurrentUpload(errorCode, response)
    }
}

/*
 * Upload progress
 *
 */
function progressUpload(oEvent) {
    if (oEvent.lengthComputable) {
        var percentComplete = (oEvent.loaded / oEvent.total) * 100
        console.log(percentComplete.toFixed(0) + "%")
        globaldispatch({
            type: Action.upload_progress,
            progress: percentComplete.toFixed(0),
            title: "S32",
            nextaction: cancelUpload,
        })
    } else {
        // Impossible because size is unknown
    }
}

/*
 * Save Preferences query
 */
function savePreferences() {
    // do some sanity check
    preferences.settings = prefs
    var blob = new Blob([JSON.stringify(preferences, null, " ")], {
        type: "application/json",
    })
    globaldispatch({
        type: Action.upload_progress,
        title: "S32",
        msg: null,
        progress: 0,
        nextaction: cancelUpload,
    })
    var file = new File([blob], preferencesFileName)
    var formData = new FormData()
    var url = "/files"
    formData.append("path", "/")
    formData.append("myfile", file, preferencesFileName)
    SendPostHttp(url, formData, successUpload, errorUpload, progressUpload)
}

/*
 * Export Settings
 *
 */
function exportSettings() {
    let data, file
    let p = 0
    const filename = preferencesFileName
    file = new Blob([JSON.stringify(preferences, null, " ")], {
        type: "application/json",
    })
    if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename)
    else {
        // Others
        let a = document.createElement("a"),
            url = URL.createObjectURL(file)
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        setTimeout(function() {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        }, 0)
    }
}

/*
 *Set state of control
 */
function setState(entry, state) {
    let controlId
    if (document.getElementById(entry + "-UI-checkbox"))
        controlId = document.getElementById(entry + "-UI-checkbox")
    if (document.getElementById(entry + "-UI-select"))
        controlId = document.getElementById(entry + "-UI-select")
    if (controlId) {
        controlId.classList.remove("is-valid")
        controlId.classList.remove("is-changed")
        controlId.classList.remove("is-invalid")
        switch (state) {
            case "modified":
                controlId.classList.add("is-changed")
                break
            case "success":
                controlId.classList.add("is-valid")
                break
            case "error":
                controlId.classList.add("is-invalid")
                break
            default:
                break
        }
    }
}

/*
 * Change state of control according context / check
 */
function updateState(entry) {
    let state = "default"

    if (preferences.settings[entry] != prefs[entry]) {
        state = "modified"
    }
    setState(entry, state)
}

/*
 * Check box control
 */
const CheckboxControl = ({ entry, title, label }) => {
    let ischecked = true
    if (preferences && preferences.settings[entry]) {
        ischecked = preferences.settings[entry] == "true" ? true : false
    }
    const toggleCheckbox = e => {
        ischecked = e.target.checked
        preferences.settings[entry] = e.target.checked ? "true" : "false"
        globaldispatch({
            type: Action.renderAll,
        })
    }
    let id = entry + "-UI-checkbox"
    useEffect(() => {
        updateState(entry)
    }, [preferences.settings[entry]])
    return (
        <label class="checkbox-control" id={id} title={title}>
            {label}
            <input
                type="checkbox"
                checked={ischecked}
                onChange={toggleCheckbox}
            />
            <span class="checkmark"></span>
        </label>
    )
}

/*
 * Load Preferences
 */
function loadLanguage(lang) {
    const url = "/" + lang + ".json" + "?" + Date.now()
    if (lang == "en") {
        setLang("en")
        updateState("language")
        globaldispatch({
            type: Action.renderAll,
        })
        return
    }
    SendGetHttp(url, loadLanguageSuccess, loadLanguageError)
    console.log("load language file " + "/" + lang + ".json")
}

/*
 * Load Language query success
 */
function loadLanguageSuccess(responseText) {
    try {
        let langressource = JSON.parse(responseText)
        setLang(prefs.language, langressource)
        updateState("language")
        globaldispatch({
            type: Action.renderAll,
        })
    } catch (err) {
        console.log("error")
        console.error(responseText)
        globaldispatch({
            type: Action.parsing_preferences_error,
            errorcode: err,
        })
        setState("language", "error")
    }
}

/*
 * Load Language query error
 */
function loadLanguageError(errorCode, responseText) {
    console.log("no valid /" + prefs.language + ".json.gz file, use default")
    setState("language", "error")
    globaldispatch({
        type: Action.error,
        errorcode: errorCode,
        msg: "S67",
    })
}

/*
 * Generate a select control
 */
const LanguageSelection = () => {
    let optionList = []
    const onChange = e => {
        prefs.language = e.target.value
        loadLanguage(prefs.language)
    }
    useEffect(() => {
        updateState("language")
    }, [prefs.language])
    let key = Object.keys(LangListRessource)
    let val = Object.values(LangListRessource)
    for (let p = 0; p < key.length; p++) {
        let st = null
        optionList.push(
            <option value={key[p]} style={st}>
                {val[p]}
            </option>
        )
    }
    return (
        <div style="margin-bottom: 15px" title={T("S69")}>
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">
                        <Globe />
                        <span class="hide-low text-button">{T("S68")}</span>
                    </span>
                </div>

                <select
                    id="language-UI-select"
                    class="form-control"
                    value={prefs.language}
                    onChange={onChange}
                >
                    {optionList}
                </select>
            </div>
        </div>
    )
}

/*
 * Settings page
 *
 */
export const WebUISettings = ({ currentPage }) => {
    if (currentPage != Setting.ui) return null
    if (typeof prefs == "undefined") {
        //lets make a copy
        prefs = JSON.parse(JSON.stringify(preferences.settings))
    }
    return (
        <div>
            <hr />
            <center>
                <div class="list-left">
                    <LanguageSelection />
                    <CheckboxControl
                        entry="banner"
                        title={T("S65")}
                        label={T("S63")}
                    />
                    <CheckboxControl
                        entry="autoload"
                        title={T("S66")}
                        label={T("S64")}
                    />
                </div>
            </center>

            <hr />
            <center>
                <button
                    type="button"
                    class="btn btn-primary"
                    title={T("S23")}
                    onClick={loadPreferences}
                >
                    <RefreshCcw />
                    <span class="hide-low text-button">{T("S50")}</span>
                </button>
                <span class={preferences.settings ? "" : " d-none"}>
                    {" "}
                    <button
                        type="button"
                        class="btn btn-primary"
                        title={T("S55")}
                        onClick={importSettings}
                    >
                        <Download />
                        <span class="hide-low text-button">{T("S54")}</span>
                    </button>
                </span>
                <span class={preferences.settings ? "" : " d-none"}>
                    {" "}
                    <button
                        type="button"
                        class="btn btn-primary"
                        title={T("S53")}
                        onClick={exportSettings}
                    >
                        <ExternalLink />
                        <span class="hide-low text-button">{T("S52")}</span>
                    </button>
                </span>{" "}
                <button
                    type="button"
                    class="btn btn-danger"
                    title={T("S62")}
                    onClick={saveAndApply}
                >
                    <Save />
                    <span class="hide-low text-button">{T("S61")}</span>
                </button>
                <input type="file" class="d-none" id="importPControl" />
                <br />
                <br />
            </center>
            <input type="file" class="d-none" id="importPControl" />
        </div>
    )
}
