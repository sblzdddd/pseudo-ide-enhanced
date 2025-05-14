// ==UserScript==
// @name         Pseudo IDE Enhanced
// @version      2024-05-16
// @description  The redesigned Pseudo Compiler
// @author       Donovan
// @match        https://ide.sciedev.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scie.dev
// @grant        none
// @import       https://code.jquery.com/jquery-3.7.1.js
// @import       https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs/loader.min.js
// @import       https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.js
// ==/UserScript==

(function() {
    // 'use strict';
    const styles= $(`
<link rel="stylesheet" href="https://sblzdddd.github.io/pseudo-ide-enhanced/ide-styles.css">
<link rel="stylesheet" data-name="vs/editor/editor.main" href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs/editor/editor.main.min.css">
<link href=" https://cdn.jsdelivr.net/npm/vscode-codicons@0.0.17/dist/codicon.min.css" rel="stylesheet">
<script src="https://kit.fontawesome.com/dd0f6de55c.js" crossorigin="anonymous"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap" rel="stylesheet">
    `)
    $("head").append(styles)
    $("body").attr("data-theme", "dark");
    $('body script:last').remove();
    $("body script[src='/js/xterm.js']").remove()
    $("body").append($("<script src='https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.js'></script>"))
    $("#terminal").remove()

    function initLayout() {
        $(".w-screen.min-h-screen").empty()
        $(".w-screen.min-h-screen").removeClass(["flex-col", "gap-4", "bg-base-200"])
        $(".w-screen.min-h-screen").addClass("root")
        $(".w-screen.min-h-screen").append($(`
            <div class="browser">
                <div class='top-panel'>
                    <div class="tabs-container">
                        <p class="tab-title">Workspace</p>
                    </div>
                </div>
                <ul class="menu w-full rounded-box">
                    <li>
                    <details open>
                        <summary>Examples</summary>
                        <ul>
                            <li onclick="loadPreset('basics')">BASICS</li>
                            <li onclick="loadPreset('io')">IO</li>
                            <li onclick="loadPreset('selection')">SELECTION</li>
                            <li onclick="loadPreset('loop')">LOOP</li>
                            <li onclick="loadPreset('arrays')">ARRAYS</li>
                            <li onclick="loadPreset('string')">STRING</li>
                            <li onclick="loadPreset('function')">FUNCTION</li>
                            <li onclick="loadPreset('builtin')">BUILTIN</li>
                            <li onclick="loadPreset('procedure')">PROCEDURE</li>
                            <li onclick="loadPreset('prime')">PRIME</li>
                            <li onclick="loadPreset('bubblesort')">BUBBLESORT</li>
                        </ul>
                    </details>
                    </li>
                </ul>
            </div>
            <div class="right flex flex-col">
                <div class='top-panel'>
                    <div class="tabs-container">
                        <p class="tab-title">Editor</p>
                    </div>
                    <div class="actions-container" role="toolbar">
                        <p id="status-text">Connecting to runtime...</p>
                        <button id="run" class="action-item" disabled>
                            <span id="run-icon" class="loading"></span>
                        </button>
                    </div>
                </div>
                <div id='monaco'></div>
                <div class='top-panel terminal-head'>
                    <div class="tabs-container">
                        <p class="tab-title">Terminal</p>
                    </div>
                </div>
                <div class='terminal-container'>
                    
                </div>
            </div>
        `))
        $("#terminal").appendTo(".terminal-container")
    }

    function initEditor() {
        console.log("Init Editor");
        $("body").append($(`
            <script type="module" src="https://sblzdddd.github.io/pseudo-ide-enhanced/pseudo-ide.js"></script>
        `));
    }   

    function initTerminal() {
        let showTerminal = true;
        function toggleTerminal() {
            if(showTerminal) {
                $(".terminal-container").hide();
            } else {
                $("#monaco").hide();
                $(".terminal-container").show(15, function(){
                    $("#monaco").show();
                });
            }
            showTerminal = !showTerminal;
        }
        $(".terminal-head").on("click", toggleTerminal)

        console.log("Init Termianl");
        var running = false;
        var input = '';
        term = new Terminal( {rows: 14, fontFamily: "Consolas", cursorBlink: "block"} )
        term.open(document.getElementById('terminal'));
        term.setOption('theme', {
            background: '#181818',
            foreground: '#EEEEEE'
        });

        // -------------------------- TERMINAL INPUT --------------------------
        // https://codepen.io/mwelgharb/pen/qBEpLEe
        var curr_line = '';
        var entries = [];
        var currPos = 0;
        var pos = 0;
        var edit = false;
        const prompt = "\33[2K\r\u001b[32m$ \u001b[37m";
        let nowPrompt = prompt;

        term.onKey(function(data) {
            if(!edit) {return;}

            nowPrompt = prompt;
            var space = 2;
            if (running) {nowPrompt = "\r"; space = 0;}
            key = data.key
            ev = data.domEvent
            const cursorX = term.buffer.active.cursorX;
            const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey &&
                !(ev.keyCode === 37 && cursorX < 3);

            if (ev.keyCode === 13) { // Enter key
                term.write("\n\r")
                if (curr_line.replace(/^\s+|\s+$/g, '').length != 0) { // Check if string is all whitespace
                    entries.push(curr_line);
                    currPos = entries.length - 1;
                    term.prompt();
                } else {
                    term.write(nowPrompt);
                }
                curr_line = '';
            } else if (ev.keyCode === 8) { // Backspace
                if (cursorX > space) {
                    curr_line = curr_line.slice(0, cursorX - (space + 1)) + curr_line.slice(cursorX - space);
                    pos = curr_line.length - cursorX + (space + 1);
                    term.write(nowPrompt + curr_line);
                    term.write('\033['.concat(pos.toString()).concat('D')); //term.write('\033[<N>D');
                    if (cursorX == space || cursorX == curr_line.length + space + 1) {
                        term.write('\033[1C')
                    }
                }
            } else if (ev.keyCode === 38 && !running) { // Up arrow
                if (entries.length > 0) {
                    if (currPos > 0) {
                        currPos -= 1;
                    }
                    curr_line = entries[currPos];
                    term.write(nowPrompt + curr_line);
                }
            } else if (ev.keyCode === 40 && !running) { // Down arrow
                currPos += 1;
                if (currPos === entries.length || entries.length === 0) {
                    currPos -= 1;
                    curr_line = '';
                    term.write(nowPrompt);
                } else {
                    curr_line = entries[currPos];
                    term.write(nowPrompt + curr_line);

                }
            } else if (printable && !(ev.keyCode === 39 && cursorX > curr_line.length + 1)) {
                if (ev.keyCode != 37 && ev.keyCode != 39) {
                    var input = ev.key;
                    if (ev.keyCode == 9) { // Tab
                        input = "    ";
                    }
                    pos = curr_line.length - (cursorX - space);
                    curr_line = [curr_line.slice(0, cursorX - space), input, curr_line.slice(cursorX - space)].join('');
                    term.write(nowPrompt + curr_line);
                    if (pos == 0) {pos -= 1}
                    term.write('\033['.concat(pos.toString()).concat('D')); //term.write('\033[<N>D');
                } else {
                    term.write(key);
                }
            }
        });
        
        term.prompt = () => {
            console.log(curr_line)
            if(!running) {
                running = true;
                console.log(curr_line);
                
                $('#run').prop("disabled", true);
                $('#run-icon').removeClass();
                $('#run-icon').addClass("loading");
                var pseudoCode = curr_line;
                console.log(connection.connection.connectionId)
                $.ajax({
                    type: "POST",
                    url: window.location.origin + "/Home/Run",
                    data: JSON.stringify({ code: pseudoCode, connectionId: connection.connection.connectionId }),
                    contentType: 'application/json',
                    //new JSAnnotation("CS", index, fabricObj.toJSON()),
                    success: function (data) {
                        console.log("GOGO");
                    },
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: window.location.origin + "/Home/Input",
                    data: JSON.stringify({ input: curr_line, connectionId: connection.connection.connectionId }),
                    contentType: 'application/json',
                    //new JSAnnotation("CS", index, fabricObj.toJSON()),
                    success: function (data) {
                        console.log("SUCCESS");
                    },
                });
            }
        };

        connection = new signalR.HubConnectionBuilder().withUrl("/terminalHub").build();
        connection.on("Output", function (output) {
            console.log(output);
            term.write(output + '\r\n')
        });
    
        connection.on("Error", function (output) {
            console.log(output)
            term.write('\u001b[31m' + output + '\r\n')
            term.write('\u001b[0m')
        });
    
        connection.on("Complete", function () {
            running = false;
            term.write('\n\r' + prompt);
            $('#run').prop("disabled", false);
            $('#run-icon').removeClass();
            $('#run-icon').addClass(["codicon codicon-play"]);
            $('#status-text').text("Ready");
        });
    

        function RunFile() {
            console.log("Run File")
            if(!showTerminal) {toggleTerminal()}
            term.clear()
            term.write("Compiling...\r\n");
            running = true;
            $('#run').prop("disabled", true);
            $('#run-icon').removeClass();
            $('#run-icon').addClass("loading");
            $('#status-text').text("Running...");
            var pseudoCode = window.editor.getValue();
            console.log(connection.connection.connectionId)
            $.ajax({
                type: "POST",
                url: window.location.origin + "/Home/Run",
                data: JSON.stringify({ code: pseudoCode, connectionId: connection.connection.connectionId }),
                contentType: 'application/json',
                //new JSAnnotation("CS", index, fabricObj.toJSON()),
                success: function (data) {
                    console.log("GOGO");
                    term.write("Running Code...\r\n\r\n");
                },
            });
        }
        $("button#run").on("click", RunFile)
    
        connection.onclose(() => {
            $('#run-icon').removeClass();
            $('#run-icon').addClass(["codicon codicon-debug-disconnect"]);
            $('#status-text').text("Disconnected.");
            
            term.write('\u001b[31m' + "Connection to server is lost" + '\r\n')
            term.write('\u001b[31m' + "Check if you have working internet, and refresh the page." + '\r\n')
            term.write('\u001b[0m')
        })
    
        connection.start().then(function (a) {
            term.write("Connected As " + connection.connection.connectionId);
            term.write("\n\r" + prompt);
            edit = true;
            $('#run').prop("disabled", false);
            $('#run-icon').removeClass();
            $('#run-icon').addClass(["codicon codicon-play"]);
            $('#status-text').text("Ready.");
        }).catch(function (err) {
            return console.error(err.toString());
        });
        toggleTerminal();
    }
    initLayout();
    initEditor();
    initTerminal();

    $(document).ready(function(){
    });
})();