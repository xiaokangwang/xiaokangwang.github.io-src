'use strict';
import fscreen from 'js/fscreen.js';
(function () {



    var editor;
    var currentEditing = "Buffer";
    var templ;
    var savedConfs = new Map();
    var qrdisp;


    //Have we got session id? if not, get it!
    var sessid = window.location.hash.substr(1);
    console.log(sessid);
    document.location.hash = "";

    var Init = function () {

        if (sessid === "") {
            $("#RequestSessToken").submit();
        }

        //Initialize Editor

        var container = document.getElementById("jsoneditor");
        var options = {
            "name": "V2Ray Config",
            onChange: () => {
                saveCurr();
            }
        };
        editor = new JSONEditor(container, options);

        var templist = new Vue({
            "el": "#TempList",
            "data": {
                items: []
            },
            methods: {
                loadformnetwork: function (event) {
                    //console.log(event);
                    var clickon = event.target;
                    var xdownload = clickon.getAttribute("xdownload");
                    var al = $(clickon).parents('.TempListElementRoot');
                    if (al.length > 0) {
                        xdownload = al[0].getAttribute("xdownload");

                    }
                    console.log(xdownload);
                    FetchTemplOverNetwork(xdownload);
                    currentEditing = "Buffer";
                }
            }
        });

        var HistorySelector = new Vue({
            "el": "#persist_list",
            "data": {
                items: [],
                Current: "Buffer"
            },
            methods: {
                load: function (event) {
                    //console.log(event);
                    var clickon = event.target;
                    var xdownload = clickon.getAttribute("xname");
                    var al = $(clickon).parents('.persist_list_top');
                    if (al.length > 0) {
                        xdownload = al[0].getAttribute("xname");

                    }
                    console.log(xdownload);
                    currentEditing = xdownload;
                    loadCurrent();
                    listRefresh();
                }
            }
        });

        qrdisp = new Vue({
            "el": "#qrscan",
            "data": {
                NotArmed: true,
                RemainTime: NaN,
                CurrentD: 0,
                CurrentQR: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgdmVyc2lvbj0iMS4xIj4KICA8Zz4KICAgIDxjaXJjbGUgc3R5bGU9ImZpbGw6bm9uZTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzAwNjY5OTtzdHJva2Utd2lkdGg6MTU7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0OyBzdHJva2UtZGFzaGFycmF5OjEwLCAzNC44Nzk4OTUwNTEyODI3NjtzdHJva2UtZGFzaG9mZnNldDo1O3N0cm9rZS1vcGFjaXR5OjEiIGlkPSJwYXRoNDQ4NyIgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNTAiPgogICAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVUeXBlPSJ4bWwiIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBmcm9tPSIwIDEwMCAxMDAiIHRvPSIzNjAgMTAwIDEwMCIgZHVyPSI0cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KICAgIDwvY2lyY2xlPgogICAgPGNpcmNsZSBzdHlsZT0iZmlsbDpub25lO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojOTkwMDAwO3N0cm9rZS13aWR0aDo4O3N0cm9rZS1saW5lY2FwOnNxdWFyZTtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDsgc3Ryb2tlLWRhc2hhcnJheTo1LCAxNS45NDM5NTEwMjM5MzE5NTQ7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxIiBpZD0icGF0aDQ0ODciIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjIwIj4KICAgICAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlVHlwZT0ieG1sIiBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgZnJvbT0iMzYwIDEwMCAxMDAiIHRvPSIwIDEwMCAxMDAiIGR1cj0iNHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgICA8L2NpcmNsZT4KICA8L2c+Cjwvc3ZnPg=="
            }
        });

        var json = {
            "Array": [1, 2, 3],
            "Boolean": true,
            "Null": null,
            "Number": 123,
            "Object": {
                "a": "b",
                "c": "d"
            },
            "String": "Hello World"
        };
        editor.set(json);

        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }


        //Start File Drop Listener

        function LoadTheFileIntoEditor(filein) {
            var firstfile = filein[0];
            var reader = new FileReader();
            reader.onload = (e) => {
                var input_string = e.target.result;
                var inps = JSON.parse(input_string);
                editor.set(inps);
                currentEditing = "Buffer";
            };
            reader.readAsText(firstfile);
        }


        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var files = evt.dataTransfer.files; // FileList object.
            console.log(files);
            LoadTheFileIntoEditor(files);
            $('#FileChooseModel').modal('hide');
        }

        function handleFileSelectS(evt) {
            var files = evt.target.files; // FileList object

            console.log(files);
            LoadTheFileIntoEditor(files);
            $('#FileChooseModel').modal('hide')
        }

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }

        // Setup the dnd listeners.
        var dropZone = document.getElementById('drop_zone');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);

        document.getElementById('files').addEventListener('change', handleFileSelectS, false);


        //Easy and Advanced Mode

        $("#switch_easy_mode").click((e) => {

            editor.setMode("tree");

        });



        $("#switch_advanced_mode").click((e) => {

            editor.setMode("code");

        });


        $("#export_to_disk").click((e) => {
            var jctx = editor.get();
            var out = JSON.stringify(jctx);
            var outb = new Blob([out], {
                type: "application/json;charset=utf-8"
            });
            saveAs(outb, currentEditing + ".json", true);

        });

        //Load Temp List From Network

        $.ajax("rc/templ.json", {
            success: (data, rline, jx) => {
                templist.items = data;
            }
        });

        function FetchTemplOverNetwork(addr) {
            $.ajax(addr, {
                success: (data, rline, jx) => {
                    console.log(data);
                    editor.set(data);
                    $('#TemplChooseModel').modal('hide');
                }
            });
        }


        //Load and Save Func

        //currentEditing

        function strMapToObj(strMap) {
            let obj = Object.create(null);
            for (let [k, v] of strMap) {
                // We don’t escape the key '__proto__'
                // which can cause problems on older engines
                obj[k] = v;
            }
            return obj;
        }

        function objToStrMap(obj) {
            let strMap = new Map();
            for (let k of Object.keys(obj)) {
                strMap.set(k, obj[k]);
            }
            return strMap;
        }

        function ConvertMapToList(strMap) {
            console.log(strMap);
            let obj = [];
            for (let [k, v] of strMap) {
                // We don’t escape the key '__proto__'
                // which can cause problems on older engines
                obj = obj.concat({
                    Name: k
                })
            }
            return obj;
        }


        function saveCurr() {
            savedConfs.set(currentEditing, editor.get());
            localStorage.setItem("persistentConf", JSON.stringify(strMapToObj(savedConfs)));
        }


        $("#save_as").click((e) => {
            var Name = prompt("Please Name the Configure File", "Configure Name");
            currentEditing = Name;
            saveCurr();
            listRefresh();
        });


        $("#removeCurrent").click((e) => {
            console.log("removeCurrent");
            if (currentEditing === "Buffer") {
                //Buffer cannnot be removed, ignore!
            } else {
                savedConfs.delete(currentEditing);
                localStorage.setItem("persistentConf", JSON.stringify(strMapToObj(savedConfs)));
                listRefresh();
            }
        });

        //Load Conf from persistent storage\

        var pstc = localStorage.getItem("persistentConf");
        if (pstc != undefined) {
            savedConfs = objToStrMap(JSON.parse(pstc));
            var buf = savedConfs.get("Buffer");
            if (buf != undefined) {
                editor.set(buf);
            }
        }

        function loadCurrent() {
            var pstc = localStorage.getItem("persistentConf");
            if (pstc != undefined) {
                savedConfs = objToStrMap(JSON.parse(pstc));
                var buf = savedConfs.get(currentEditing);
                if (buf != undefined) {
                    editor.set(buf);
                }
            }
        }

        function listRefresh() {
          if (pstc != undefined) {
              HistorySelector.items = ConvertMapToList(objToStrMap(JSON.parse(pstc)));
              HistorySelector.Current = currentEditing;
          }
        }

        listRefresh();

        var apibase = "https://api.kkdev.org/API/";
        var papibase = "https://api.kkdev.org/PAPI/";

        $("#convert_libv2ray").click((e) => {
            $.ajax(apibase + "V2RayConvertJson", {
                method: "POST",
                headers: {
                    "X-Sess-Token": sessid
                },
                data: {
                    "JsonPayload": JSON.stringify(editor.get())
                },
                success: (data, rline, jx) => {
                    editor.set(JSON.parse(data));
                }
            });

        });

        $("#export_to_qr").click((e) => {
            var FullScreenArea = document.getElementById('qrscan');
            qrdisp.NotArmed = false;
            fscreen.onfullscreenchange = () => {
                if (fscreen.fullscreenElement === null) {
                    qrdisp.NotArmed = true;
                    clearInterval(QRRefresherTimer);
                }
            };
            fscreen.requestFullscreen(FullScreenArea);
            $.ajax(apibase + "V2RayConvertToSegment", {
                method: "POST",
                headers: {
                    "X-Sess-Token": sessid
                },
                data: {
                    "Payload": JSON.stringify(editor.get())
                },
                success: (data, rline, jx) => {
                    var sum = parseInt(data);
                    displayQR(sum);
                }
            });

        });



        function displayQR(sum) {
            function nextQR() {
                qrdisp.RemainTime = 15;
                qrdisp.CurrentD++;
                if (qrdisp.CurrentD === sum) {
                    qrdisp.CurrentD = 0;
                }
                var url = papibase + "DispPNG" + "/" + sessid + "/" + qrdisp.CurrentD;
                qrdisp.CurrentQR = url;
                console.log(qrdisp.CurrentQR);
            }

            function SecTick() {
                qrdisp.RemainTime--;
                if (qrdisp.RemainTime < 0) {
                    nextQR();
                }
            }

            QRRefresherTimer = setInterval(function () {
                SecTick();
            }, 1000);
            qrdisp.CurrentD = 0;
            nextQR();
            nextQRI = nextQR;
        }

    }
    var nextQRI;
    $(window).keypress(function (e) {
        if (e.keyCode === 0 || e.keyCode === 32) {
            e.preventDefault()
            console.log('Space pressed');
            if (!qrdisp.NotArmed && nextQRI != undefined) {
                nextQRI();
            }
        }
    });

    var QRRefresherTimer;

    $(document).ready(function () {
        Init();
    });


}).call(this);
