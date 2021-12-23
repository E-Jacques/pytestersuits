import * as assert from "assert";
import * as coverReportFunc from "../../extension_func/coverageReport/func";

suite("Testing cover report data recuperation", () => {
    const data = `<!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Coverage report</title>
        <link rel="icon" sizes="32x32" href="favicon_32.png">
        <link rel="stylesheet" href="style.css" type="text/css">
        <script type="text/javascript" src="coverage_html.js" defer></script>
    </head>
    <body class="indexfile">
    <header>
        <div class="content">
            <h1>Coverage report:
                <span class="pc_cov">93%</span>
            </h1>
            <div id="help_panel_wrapper">
                <input id="help_panel_state" type="checkbox">
                <label for="help_panel_state">
                    <img id="keyboard_icon" src="keybd_closed.png" alt="Show/hide keyboard shortcuts" />
                </label>
                <div id="help_panel">
                    <p class="legend">Shortcuts on this page</p>
                    <div>
                        <p class="keyhelp">
                            <kbd>n</kbd>
                            <kbd>s</kbd>
                            <kbd>m</kbd>
                            <kbd>x</kbd>
                            <kbd>c</kbd> &nbsp; change column sorting
                        </p>
                    </div>
                </div>
            </div>
            <form id="filter_container">
                <input id="filter" type="text" value="" placeholder="filter..." />
            </form>
        </div>
    </header>
    <main id="index">
        <table class="index" data-sortable>
            <thead>
                <tr class="tablehead" title="Click to sort">
                    <th class="name left" aria-sort="none" data-shortcut="n">Module</th>
                    <th aria-sort="none" data-default-sort-order="descending" data-shortcut="s">statements</th>
                    <th aria-sort="none" data-default-sort-order="descending" data-shortcut="m">missing</th>
                    <th aria-sort="none" data-default-sort-order="descending" data-shortcut="x">excluded</th>
                    <th class="right" aria-sort="none" data-shortcut="c">coverage</th>
                </tr>
            </thead>
            <tbody>
                <tr class="file">
                    <td class="name left"><a href="auth_py.html">auth.py</a></td>
                    <td>43</td>
                    <td>1</td>
                    <td>0</td>
                    <td class="right" data-ratio="42 43">98%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="automaton_py.html">automaton.py</a></td>
                    <td>79</td>
                    <td>10</td>
                    <td>0</td>
                    <td class="right" data-ratio="69 79">87%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="automaton_response_py.html">automaton_response.py</a></td>
                    <td>4</td>
                    <td>0</td>
                    <td>0</td>
                    <td class="right" data-ratio="4 4">100%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="command_py.html">command.py</a></td>
                    <td>22</td>
                    <td>0</td>
                    <td>0</td>
                    <td class="right" data-ratio="22 22">100%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="exceptions_py.html">exceptions.py</a></td>
                    <td>18</td>
                    <td>0</td>
                    <td>0</td>
                    <td class="right" data-ratio="18 18">100%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="log_py.html">log.py</a></td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td class="right" data-ratio="0 0">100%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="main_py.html">main.py</a></td>
                    <td>4</td>
                    <td>4</td>
                    <td>0</td>
                    <td class="right" data-ratio="0 4">0%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="role_py.html">role.py</a></td>
                    <td>25</td>
                    <td>0</td>
                    <td>0</td>
                    <td class="right" data-ratio="25 25">100%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="test_auth_py.html">test_auth.py</a></td>
                    <td>43</td>
                    <td>8</td>
                    <td>0</td>
                    <td class="right" data-ratio="35 43">81%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="test_automaton_py.html">test_automaton.py</a></td>
                    <td>77</td>
                    <td>0</td>
                    <td>0</td>
                    <td class="right" data-ratio="77 77">100%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="test_command_py.html">test_command.py</a></td>
                    <td>10</td>
                    <td>0</td>
                    <td>0</td>
                    <td class="right" data-ratio="10 10">100%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="test_log_py.html">test_log.py</a></td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td class="right" data-ratio="0 0">100%</td>
                </tr>
                <tr class="file">
                    <td class="name left"><a href="test_role_py.html">test_role.py</a></td>
                    <td>19</td>
                    <td>0</td>
                    <td>0</td>
                    <td class="right" data-ratio="19 19">100%</td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="total">
                    <td class="name left">Total</td>
                    <td>344</td>
                    <td>23</td>
                    <td>0</td>
                    <td class="right" data-ratio="321 344">93%</td>
                </tr>
            </tfoot>
        </table>
        <p id="no_rows">
            No items found using the specified filter.
        </p>
    </main>
    <footer>
        <div class="content">
            <p>
                <a class="nav" href="https://coverage.readthedocs.io">coverage.py v6.1.1</a>,
                created at 2021-11-30 15:44 +0100
            </p>
        </div>
    </footer>
    </body>
    </html>`;

    test("Returning percent for file", () => {
        const dataAnalyze = coverReportFunc.extractFilesPercentages(data);
        assert.strictEqual(dataAnalyze.filter(o => o.filename === "auth.py").length, 1);
        assert.strictEqual(dataAnalyze.filter(o => o.filename === "auth.py")[0].percent, 98);
        assert.strictEqual(dataAnalyze.filter(o => o.filename === "main.py").length, 1);
        assert.strictEqual(dataAnalyze.filter(o => o.filename === "main.py")[0].percent, 0);
        assert.strictEqual(dataAnalyze.filter(o => o.filename === "test_auth.py").length, 1);
        assert.strictEqual(dataAnalyze.filter(o => o.filename === "test_auth.py")[0].percent, 81);
        assert.strictEqual(dataAnalyze.filter(o => o.filename === "test_role.py").length, 1);
        assert.strictEqual(dataAnalyze.filter(o => o.filename === "test_role.py")[0].percent, 100);
    });
});

suite("Testing covered line", () => {
    const data = `<!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=emulateIE7" />
        <title>Coverage for auth.py: 98%</title>
        <link rel="icon" sizes="32x32" href="favicon_32.png">
        <link rel="stylesheet" href="style.css" type="text/css">
        <script type="text/javascript" src="coverage_html.js" defer></script>
    </head>
    <body class="pyfile">
    <header>
        <div class="content">
            <h1>
                <span class="text">Coverage for </span><b>auth.py</b>:
                <span class="pc_cov">98%</span>
            </h1>
            <div id="help_panel_wrapper">
                <input id="help_panel_state" type="checkbox">
                <label for="help_panel_state">
                    <img id="keyboard_icon" src="keybd_closed.png" alt="Show/hide keyboard shortcuts" />
                </label>
                <div id="help_panel">
                    <p class="legend">Shortcuts on this page</p>
                    <div>
                        <p class="keyhelp">
                            <kbd>r</kbd>
                            <kbd>m</kbd>
                            <kbd>x</kbd>
                            &nbsp; toggle line displays
                        </p>
                        <p class="keyhelp">
                            <kbd>j</kbd>
                            <kbd>k</kbd> &nbsp; next/prev highlighted chunk
                        </p>
                        <p class="keyhelp">
                            <kbd>0</kbd> &nbsp; (zero) top of page
                        </p>
                        <p class="keyhelp">
                            <kbd>1</kbd> &nbsp; (one) first highlighted chunk
                        </p>
                    </div>
                </div>
            </div>
            <h2>
                <span class="text">43 statements &nbsp;</span>
                <button type="button" class="run button_toggle_run" value="run" data-shortcut="r" title="Toggle lines run">42<span class="text"> run</span></button>
                <button type="button" class="mis show_mis button_toggle_mis" value="mis" data-shortcut="m" title="Toggle lines missing">1<span class="text"> missing</span></button>
                <button type="button" class="exc show_exc button_toggle_exc" value="exc" data-shortcut="x" title="Toggle lines excluded">0<span class="text"> excluded</span></button>
            </h2>
            <div style="display: none;">
                <button type="button" class="button_next_chunk" data-shortcut="j">Next highlighted chunk</button>
                <button type="button" class="button_prev_chunk" data-shortcut="k">Previous highlighted chunk</button>
                <button type="button" class="button_top_of_page" data-shortcut="0">Goto top of page</button>
                <button type="button" class="button_first_chunk" data-shortcut="1">Goto first highlighted chunk</button>
            </div>
        </div>
    </header>
    <main id="source">
        <p class="run"><span class="n"><a id="t1" href="#t1">1</a></span><span class="t"><span class="key">from</span> <span class="nam">hashlib</span> <span class="key">import</span> <span class="nam">sha256</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t2" href="#t2">2</a></span><span class="t"><span class="key">from</span> <span class="nam">exceptions</span> <span class="key">import</span> <span class="nam">PathIsEmpty</span><span class="op">,</span> <span class="nam">IncorrectFileFormat</span><span class="op">,</span> <span class="nam">UnknownRole</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t3" href="#t3">3</a></span><span class="t"><span class="key">from</span> <span class="nam">role</span> <span class="key">import</span> <span class="nam">AdminRole</span><span class="op">,</span> <span class="nam">Role</span><span class="op">,</span> <span class="nam">UserRole</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t4" href="#t4">4</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t5" href="#t5">5</a></span><span class="t"><span class="key">def</span> <span class="nam">hash_password</span><span class="op">(</span><span class="nam">name</span><span class="op">:</span> <span class="nam">str</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">:</span> <span class="nam">str</span><span class="op">)</span> <span class="op">-></span> <span class="nam">str</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t6" href="#t6">6</a></span><span class="t">    <span class="key">if</span> <span class="key">not</span> <span class="nam">isinstance</span><span class="op">(</span><span class="nam">name</span><span class="op">,</span> <span class="nam">str</span><span class="op">)</span> <span class="key">or</span> <span class="key">not</span> <span class="nam">isinstance</span><span class="op">(</span><span class="nam">passwd</span><span class="op">,</span> <span class="nam">str</span><span class="op">)</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t7" href="#t7">7</a></span><span class="t">        <span class="key">raise</span> <span class="nam">TypeError</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t8" href="#t8">8</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t9" href="#t9">9</a></span><span class="t">    <span class="nam">sel</span> <span class="op">=</span> <span class="str">"python3-"</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t10" href="#t10">10</a></span><span class="t">    <span class="nam">new_str</span> <span class="op">=</span> <span class="nam">sel</span> <span class="op">+</span> <span class="nam">name</span> <span class="op">+</span> <span class="nam">passwd</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t11" href="#t11">11</a></span><span class="t">    <span class="key">return</span> <span class="nam">sha256</span><span class="op">(</span><span class="nam">new_str</span><span class="op">.</span><span class="nam">encode</span><span class="op">(</span><span class="str">'ascii'</span><span class="op">)</span><span class="op">)</span><span class="op">.</span><span class="nam">hexdigest</span><span class="op">(</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t12" href="#t12">12</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t13" href="#t13">13</a></span><span class="t"><span class="key">def</span> <span class="nam">check_password</span><span class="op">(</span><span class="nam">input_hash</span><span class="op">:</span> <span class="nam">str</span><span class="op">,</span> <span class="nam">name</span><span class="op">:</span> <span class="nam">str</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">:</span> <span class="nam">str</span><span class="op">)</span> <span class="op">-></span> <span class="nam">bool</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t14" href="#t14">14</a></span><span class="t">    <span class="nam">password_hash</span> <span class="op">=</span> <span class="nam">hash_password</span><span class="op">(</span><span class="nam">name</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t15" href="#t15">15</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t16" href="#t16">16</a></span><span class="t">    <span class="key">return</span> <span class="nam">input_hash</span> <span class="op">==</span> <span class="nam">password_hash</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t17" href="#t17">17</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t18" href="#t18">18</a></span><span class="t"><span class="key">class</span> <span class="nam">User</span><span class="op">(</span><span class="op">)</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t19" href="#t19">19</a></span><span class="t">    <span class="com"># pylint: disable=unused-argument</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t20" href="#t20">20</a></span><span class="t">    <span class="key">def</span> <span class="nam">__init__</span><span class="op">(</span><span class="nam">self</span><span class="op">,</span> <span class="nam">path</span><span class="op">=</span><span class="str">""</span><span class="op">,</span> <span class="nam">name</span><span class="op">=</span><span class="str">""</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">=</span><span class="str">""</span><span class="op">)</span> <span class="op">-></span> <span class="key">None</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t21" href="#t21">21</a></span><span class="t">        <span class="key">if</span> <span class="nam">path</span> <span class="op">==</span> <span class="str">""</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t22" href="#t22">22</a></span><span class="t">            <span class="key">raise</span> <span class="nam">PathIsEmpty</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t23" href="#t23">23</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t24" href="#t24">24</a></span><span class="t">        <span class="nam">self</span><span class="op">.</span><span class="nam">name</span> <span class="op">=</span> <span class="str">""</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t25" href="#t25">25</a></span><span class="t">        <span class="nam">self</span><span class="op">.</span><span class="nam">role</span><span class="op">:</span> <span class="nam">Role</span> <span class="op">=</span> <span class="key">None</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t26" href="#t26">26</a></span><span class="t">        <span class="nam">self</span><span class="op">.</span><span class="nam">password_hashed</span> <span class="op">=</span> <span class="str">""</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t27" href="#t27">27</a></span><span class="t">        <span class="nam">self</span><span class="op">.</span><span class="nam">conf_file_path</span> <span class="op">=</span> <span class="nam">path</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t28" href="#t28">28</a></span><span class="t">        <span class="nam">self</span><span class="op">.</span><span class="nam">read_conf_file</span><span class="op">(</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t29" href="#t29">29</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t30" href="#t30">30</a></span><span class="t">    <span class="key">def</span> <span class="nam">interpret_conf_file</span><span class="op">(</span><span class="nam">self</span><span class="op">,</span> <span class="nam">line</span><span class="op">)</span> <span class="op">-></span> <span class="key">None</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t31" href="#t31">31</a></span><span class="t">        <span class="nam">pair</span> <span class="op">=</span> <span class="nam">line</span><span class="op">.</span><span class="nam">split</span><span class="op">(</span><span class="str">"="</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t32" href="#t32">32</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t33" href="#t33">33</a></span><span class="t">        <span class="key">if</span> <span class="nam">len</span><span class="op">(</span><span class="nam">pair</span><span class="op">)</span> <span class="op">></span> <span class="num">2</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t34" href="#t34">34</a></span><span class="t">            <span class="key">raise</span> <span class="nam">IncorrectFileFormat</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t35" href="#t35">35</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t36" href="#t36">36</a></span><span class="t">        <span class="nam">key</span><span class="op">,</span> <span class="nam">value</span> <span class="op">=</span> <span class="nam">pair</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t37" href="#t37">37</a></span><span class="t">        <span class="key">if</span> <span class="nam">key</span> <span class="op">==</span> <span class="str">"USER"</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t38" href="#t38">38</a></span><span class="t">            <span class="nam">self</span><span class="op">.</span><span class="nam">name</span> <span class="op">=</span> <span class="nam">value</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t39" href="#t39">39</a></span><span class="t">        <span class="key">elif</span> <span class="nam">key</span> <span class="op">==</span> <span class="str">"ROLE"</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t40" href="#t40">40</a></span><span class="t">            <span class="key">if</span> <span class="nam">value</span><span class="op">.</span><span class="nam">lower</span><span class="op">(</span><span class="op">)</span> <span class="key">not</span> <span class="key">in</span> <span class="op">[</span><span class="str">"admin"</span><span class="op">,</span> <span class="str">"user"</span><span class="op">]</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t41" href="#t41">41</a></span><span class="t">                <span class="key">raise</span> <span class="nam">UnknownRole</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t42" href="#t42">42</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t43" href="#t43">43</a></span><span class="t">            <span class="nam">self</span><span class="op">.</span><span class="nam">role</span> <span class="op">=</span> <span class="op">{</span><span class="str">'admin'</span><span class="op">:</span> <span class="nam">AdminRole</span><span class="op">,</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t44" href="#t44">44</a></span><span class="t">                        <span class="str">'user'</span><span class="op">:</span> <span class="nam">UserRole</span><span class="op">}</span><span class="op">[</span><span class="nam">value</span><span class="op">.</span><span class="nam">lower</span><span class="op">(</span><span class="op">)</span><span class="op">]</span><span class="op">(</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t45" href="#t45">45</a></span><span class="t">        <span class="key">elif</span> <span class="nam">key</span> <span class="op">==</span> <span class="str">"PASSWD"</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t46" href="#t46">46</a></span><span class="t">            <span class="nam">self</span><span class="op">.</span><span class="nam">password_hashed</span> <span class="op">=</span> <span class="nam">value</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t47" href="#t47">47</a></span><span class="t">        <span class="key">else</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t48" href="#t48">48</a></span><span class="t">            <span class="key">raise</span> <span class="nam">IncorrectFileFormat</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t49" href="#t49">49</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t50" href="#t50">50</a></span><span class="t">    <span class="com"># pylint: disable=unused-variable</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t51" href="#t51">51</a></span><span class="t">    <span class="key">def</span> <span class="nam">create_conf_file</span><span class="op">(</span><span class="nam">self</span><span class="op">,</span> <span class="nam">path</span><span class="op">)</span> <span class="op">-></span> <span class="key">None</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="mis show_mis"><span class="n"><a id="t52" href="#t52">52</a></span><span class="t">        <span class="key">pass</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t53" href="#t53">53</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t54" href="#t54">54</a></span><span class="t">    <span class="key">def</span> <span class="nam">read_conf_file</span><span class="op">(</span><span class="nam">self</span><span class="op">)</span> <span class="op">-></span> <span class="key">None</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t55" href="#t55">55</a></span><span class="t">        <span class="key">with</span> <span class="nam">open</span><span class="op">(</span><span class="nam">self</span><span class="op">.</span><span class="nam">conf_file_path</span><span class="op">,</span> <span class="str">'r'</span><span class="op">,</span> <span class="nam">encoding</span><span class="op">=</span><span class="str">"utf-8"</span><span class="op">)</span> <span class="key">as</span> <span class="nam">file</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t56" href="#t56">56</a></span><span class="t">            <span class="key">for</span> <span class="nam">line</span> <span class="key">in</span> <span class="nam">file</span><span class="op">.</span><span class="nam">read</span><span class="op">(</span><span class="op">)</span><span class="op">.</span><span class="nam">split</span><span class="op">(</span><span class="str">"\n"</span><span class="op">)</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t57" href="#t57">57</a></span><span class="t">                <span class="nam">self</span><span class="op">.</span><span class="nam">interpret_conf_file</span><span class="op">(</span><span class="nam">line</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t58" href="#t58">58</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t59" href="#t59">59</a></span><span class="t">    <span class="key">def</span> <span class="nam">login</span><span class="op">(</span><span class="nam">self</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">:</span> <span class="nam">str</span><span class="op">)</span> <span class="op">-></span> <span class="nam">bool</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t60" href="#t60">60</a></span><span class="t">        <span class="key">return</span> <span class="nam">check_password</span><span class="op">(</span><span class="nam">self</span><span class="op">.</span><span class="nam">password_hashed</span><span class="op">,</span> <span class="nam">self</span><span class="op">.</span><span class="nam">name</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
    </main>
    <footer>
        <div class="content">
            <p>
                <a class="nav" href="index.html">&#xab; index</a> &nbsp; &nbsp; <a class="nav" href="https://coverage.readthedocs.io">coverage.py v6.1.1</a>,
                created at 2021-11-30 15:44 +0100
            </p>
        </div>
    </footer>
    </body>
    </html>`;
    const linesData = coverReportFunc.extractLinesPercentages(data);

    test("Should return correct tested lines", () => {
        assert(linesData.tested.includes(1));
        assert(linesData.tested.includes(3));
        assert(!linesData.tested.includes(4));
        assert(!linesData.tested.includes(52));
    });

    test("Should return corret untested lines", () => {
        assert(linesData.notTested.includes(52));
        assert(!linesData.notTested.includes(10));
        assert(!linesData.notTested.includes(12));
    });

    test("notHandled should be empty for no modified file", () => {
        assert.strictEqual(linesData.notHandled.length, 0);
    });
});

suite("Change tested and untested lines index", () => {
    const data = `<!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=emulateIE7" />
        <title>Coverage for auth.py: 98%</title>
        <link rel="icon" sizes="32x32" href="favicon_32.png">
        <link rel="stylesheet" href="style.css" type="text/css">
        <script type="text/javascript" src="coverage_html.js" defer></script>
    </head>
    <body class="pyfile">
    <header>
        <div class="content">
            <h1>
                <span class="text">Coverage for </span><b>auth.py</b>:
                <span class="pc_cov">98%</span>
            </h1>
            <div id="help_panel_wrapper">
                <input id="help_panel_state" type="checkbox">
                <label for="help_panel_state">
                    <img id="keyboard_icon" src="keybd_closed.png" alt="Show/hide keyboard shortcuts" />
                </label>
                <div id="help_panel">
                    <p class="legend">Shortcuts on this page</p>
                    <div>
                        <p class="keyhelp">
                            <kbd>r</kbd>
                            <kbd>m</kbd>
                            <kbd>x</kbd>
                            &nbsp; toggle line displays
                        </p>
                        <p class="keyhelp">
                            <kbd>j</kbd>
                            <kbd>k</kbd> &nbsp; next/prev highlighted chunk
                        </p>
                        <p class="keyhelp">
                            <kbd>0</kbd> &nbsp; (zero) top of page
                        </p>
                        <p class="keyhelp">
                            <kbd>1</kbd> &nbsp; (one) first highlighted chunk
                        </p>
                    </div>
                </div>
            </div>
            <h2>
                <span class="text">43 statements &nbsp;</span>
                <button type="button" class="run button_toggle_run" value="run" data-shortcut="r" title="Toggle lines run">42<span class="text"> run</span></button>
                <button type="button" class="mis show_mis button_toggle_mis" value="mis" data-shortcut="m" title="Toggle lines missing">1<span class="text"> missing</span></button>
                <button type="button" class="exc show_exc button_toggle_exc" value="exc" data-shortcut="x" title="Toggle lines excluded">0<span class="text"> excluded</span></button>
            </h2>
            <div style="display: none;">
                <button type="button" class="button_next_chunk" data-shortcut="j">Next highlighted chunk</button>
                <button type="button" class="button_prev_chunk" data-shortcut="k">Previous highlighted chunk</button>
                <button type="button" class="button_top_of_page" data-shortcut="0">Goto top of page</button>
                <button type="button" class="button_first_chunk" data-shortcut="1">Goto first highlighted chunk</button>
            </div>
        </div>
    </header>
    <main id="source">
        <p class="run"><span class="n"><a id="t1" href="#t1">1</a></span><span class="t"><span class="key">from</span> <span class="nam">hashlib</span> <span class="key">import</span> <span class="nam">sha256</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t2" href="#t2">2</a></span><span class="t"><span class="key">from</span> <span class="nam">exceptions</span> <span class="key">import</span> <span class="nam">PathIsEmpty</span><span class="op">,</span> <span class="nam">IncorrectFileFormat</span><span class="op">,</span> <span class="nam">UnknownRole</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t3" href="#t3">3</a></span><span class="t"><span class="key">from</span> <span class="nam">role</span> <span class="key">import</span> <span class="nam">AdminRole</span><span class="op">,</span> <span class="nam">Role</span><span class="op">,</span> <span class="nam">UserRole</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t4" href="#t4">4</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t5" href="#t5">5</a></span><span class="t"><span class="key">def</span> <span class="nam">hash_password</span><span class="op">(</span><span class="nam">name</span><span class="op">:</span> <span class="nam">str</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">:</span> <span class="nam">str</span><span class="op">)</span> <span class="op">-></span> <span class="nam">str</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t6" href="#t6">6</a></span><span class="t">    <span class="key">if</span> <span class="key">not</span> <span class="nam">isinstance</span><span class="op">(</span><span class="nam">name</span><span class="op">,</span> <span class="nam">str</span><span class="op">)</span> <span class="key">or</span> <span class="key">not</span> <span class="nam">isinstance</span><span class="op">(</span><span class="nam">passwd</span><span class="op">,</span> <span class="nam">str</span><span class="op">)</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t7" href="#t7">7</a></span><span class="t">        <span class="key">raise</span> <span class="nam">TypeError</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t8" href="#t8">8</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t9" href="#t9">9</a></span><span class="t">    <span class="nam">sel</span> <span class="op">=</span> <span class="str">"python3-"</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t10" href="#t10">10</a></span><span class="t">    <span class="nam">new_str</span> <span class="op">=</span> <span class="nam">sel</span> <span class="op">+</span> <span class="nam">name</span> <span class="op">+</span> <span class="nam">passwd</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t11" href="#t11">11</a></span><span class="t">    <span class="key">return</span> <span class="nam">sha256</span><span class="op">(</span><span class="nam">new_str</span><span class="op">.</span><span class="nam">encode</span><span class="op">(</span><span class="str">'ascii'</span><span class="op">)</span><span class="op">)</span><span class="op">.</span><span class="nam">hexdigest</span><span class="op">(</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t12" href="#t12">12</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t13" href="#t13">13</a></span><span class="t"><span class="key">def</span> <span class="nam">check_password</span><span class="op">(</span><span class="nam">input_hash</span><span class="op">:</span> <span class="nam">str</span><span class="op">,</span> <span class="nam">name</span><span class="op">:</span> <span class="nam">str</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">:</span> <span class="nam">str</span><span class="op">)</span> <span class="op">-></span> <span class="nam">bool</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t14" href="#t14">14</a></span><span class="t">    <span class="nam">password_hash</span> <span class="op">=</span> <span class="nam">hash_password</span><span class="op">(</span><span class="nam">name</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t15" href="#t15">15</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t16" href="#t16">16</a></span><span class="t">    <span class="key">return</span> <span class="nam">input_hash</span> <span class="op">==</span> <span class="nam">password_hash</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t17" href="#t17">17</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t18" href="#t18">18</a></span><span class="t"><span class="key">class</span> <span class="nam">User</span><span class="op">(</span><span class="op">)</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t19" href="#t19">19</a></span><span class="t">    <span class="com"># pylint: disable=unused-argument</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t20" href="#t20">20</a></span><span class="t">    <span class="key">def</span> <span class="nam">__init__</span><span class="op">(</span><span class="nam">self</span><span class="op">,</span> <span class="nam">path</span><span class="op">=</span><span class="str">""</span><span class="op">,</span> <span class="nam">name</span><span class="op">=</span><span class="str">""</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">=</span><span class="str">""</span><span class="op">)</span> <span class="op">-></span> <span class="key">None</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t21" href="#t21">21</a></span><span class="t">        <span class="key">if</span> <span class="nam">path</span> <span class="op">==</span> <span class="str">""</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t22" href="#t22">22</a></span><span class="t">            <span class="key">raise</span> <span class="nam">PathIsEmpty</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t23" href="#t23">23</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t24" href="#t24">24</a></span><span class="t">        <span class="nam">self</span><span class="op">.</span><span class="nam">name</span> <span class="op">=</span> <span class="str">""</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t25" href="#t25">25</a></span><span class="t">        <span class="nam">self</span><span class="op">.</span><span class="nam">role</span><span class="op">:</span> <span class="nam">Role</span> <span class="op">=</span> <span class="key">None</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t26" href="#t26">26</a></span><span class="t">        <span class="nam">self</span><span class="op">.</span><span class="nam">password_hashed</span> <span class="op">=</span> <span class="str">""</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t27" href="#t27">27</a></span><span class="t">        <span class="nam">self</span><span class="op">.</span><span class="nam">conf_file_path</span> <span class="op">=</span> <span class="nam">path</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t28" href="#t28">28</a></span><span class="t">        <span class="nam">self</span><span class="op">.</span><span class="nam">read_conf_file</span><span class="op">(</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t29" href="#t29">29</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t30" href="#t30">30</a></span><span class="t">    <span class="key">def</span> <span class="nam">interpret_conf_file</span><span class="op">(</span><span class="nam">self</span><span class="op">,</span> <span class="nam">line</span><span class="op">)</span> <span class="op">-></span> <span class="key">None</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t31" href="#t31">31</a></span><span class="t">        <span class="nam">pair</span> <span class="op">=</span> <span class="nam">line</span><span class="op">.</span><span class="nam">split</span><span class="op">(</span><span class="str">"="</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t32" href="#t32">32</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t33" href="#t33">33</a></span><span class="t">        <span class="key">if</span> <span class="nam">len</span><span class="op">(</span><span class="nam">pair</span><span class="op">)</span> <span class="op">></span> <span class="num">2</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t34" href="#t34">34</a></span><span class="t">            <span class="key">raise</span> <span class="nam">IncorrectFileFormat</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t35" href="#t35">35</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t36" href="#t36">36</a></span><span class="t">        <span class="nam">key</span><span class="op">,</span> <span class="nam">value</span> <span class="op">=</span> <span class="nam">pair</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t37" href="#t37">37</a></span><span class="t">        <span class="key">if</span> <span class="nam">key</span> <span class="op">==</span> <span class="str">"USER"</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t38" href="#t38">38</a></span><span class="t">            <span class="nam">self</span><span class="op">.</span><span class="nam">name</span> <span class="op">=</span> <span class="nam">value</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t39" href="#t39">39</a></span><span class="t">        <span class="key">elif</span> <span class="nam">key</span> <span class="op">==</span> <span class="str">"ROLE"</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t40" href="#t40">40</a></span><span class="t">            <span class="key">if</span> <span class="nam">value</span><span class="op">.</span><span class="nam">lower</span><span class="op">(</span><span class="op">)</span> <span class="key">not</span> <span class="key">in</span> <span class="op">[</span><span class="str">"admin"</span><span class="op">,</span> <span class="str">"user"</span><span class="op">]</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t41" href="#t41">41</a></span><span class="t">                <span class="key">raise</span> <span class="nam">UnknownRole</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t42" href="#t42">42</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t43" href="#t43">43</a></span><span class="t">            <span class="nam">self</span><span class="op">.</span><span class="nam">role</span> <span class="op">=</span> <span class="op">{</span><span class="str">'admin'</span><span class="op">:</span> <span class="nam">AdminRole</span><span class="op">,</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t44" href="#t44">44</a></span><span class="t">                        <span class="str">'user'</span><span class="op">:</span> <span class="nam">UserRole</span><span class="op">}</span><span class="op">[</span><span class="nam">value</span><span class="op">.</span><span class="nam">lower</span><span class="op">(</span><span class="op">)</span><span class="op">]</span><span class="op">(</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t45" href="#t45">45</a></span><span class="t">        <span class="key">elif</span> <span class="nam">key</span> <span class="op">==</span> <span class="str">"PASSWD"</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t46" href="#t46">46</a></span><span class="t">            <span class="nam">self</span><span class="op">.</span><span class="nam">password_hashed</span> <span class="op">=</span> <span class="nam">value</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t47" href="#t47">47</a></span><span class="t">        <span class="key">else</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t48" href="#t48">48</a></span><span class="t">            <span class="key">raise</span> <span class="nam">IncorrectFileFormat</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t49" href="#t49">49</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t50" href="#t50">50</a></span><span class="t">    <span class="com"># pylint: disable=unused-variable</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t51" href="#t51">51</a></span><span class="t">    <span class="key">def</span> <span class="nam">create_conf_file</span><span class="op">(</span><span class="nam">self</span><span class="op">,</span> <span class="nam">path</span><span class="op">)</span> <span class="op">-></span> <span class="key">None</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="mis show_mis"><span class="n"><a id="t52" href="#t52">52</a></span><span class="t">        <span class="key">pass</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t53" href="#t53">53</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t54" href="#t54">54</a></span><span class="t">    <span class="key">def</span> <span class="nam">read_conf_file</span><span class="op">(</span><span class="nam">self</span><span class="op">)</span> <span class="op">-></span> <span class="key">None</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t55" href="#t55">55</a></span><span class="t">        <span class="key">with</span> <span class="nam">open</span><span class="op">(</span><span class="nam">self</span><span class="op">.</span><span class="nam">conf_file_path</span><span class="op">,</span> <span class="str">'r'</span><span class="op">,</span> <span class="nam">encoding</span><span class="op">=</span><span class="str">"utf-8"</span><span class="op">)</span> <span class="key">as</span> <span class="nam">file</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t56" href="#t56">56</a></span><span class="t">            <span class="key">for</span> <span class="nam">line</span> <span class="key">in</span> <span class="nam">file</span><span class="op">.</span><span class="nam">read</span><span class="op">(</span><span class="op">)</span><span class="op">.</span><span class="nam">split</span><span class="op">(</span><span class="str">"\n"</span><span class="op">)</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t57" href="#t57">57</a></span><span class="t">                <span class="nam">self</span><span class="op">.</span><span class="nam">interpret_conf_file</span><span class="op">(</span><span class="nam">line</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
        <p class="pln"><span class="n"><a id="t58" href="#t58">58</a></span><span class="t">&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t59" href="#t59">59</a></span><span class="t">    <span class="key">def</span> <span class="nam">login</span><span class="op">(</span><span class="nam">self</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">:</span> <span class="nam">str</span><span class="op">)</span> <span class="op">-></span> <span class="nam">bool</span><span class="op">:</span>&nbsp;</span><span class="r"></span></p>
        <p class="run"><span class="n"><a id="t60" href="#t60">60</a></span><span class="t">        <span class="key">return</span> <span class="nam">check_password</span><span class="op">(</span><span class="nam">self</span><span class="op">.</span><span class="nam">password_hashed</span><span class="op">,</span> <span class="nam">self</span><span class="op">.</span><span class="nam">name</span><span class="op">,</span> <span class="nam">passwd</span><span class="op">)</span>&nbsp;</span><span class="r"></span></p>
    </main>
    <footer>
        <div class="content">
            <p>
                <a class="nav" href="index.html">&#xab; index</a> &nbsp; &nbsp; <a class="nav" href="https://coverage.readthedocs.io">coverage.py v6.1.1</a>,
                created at 2021-11-30 15:44 +0100
            </p>
        </div>
    </footer>
    </body>
    </html>`;

    test("Add at first line should move all lines", () => {
        let linesReport = coverReportFunc.moveLinesPercentages(data, 1, 2);
        assert(!linesReport.notTested.includes(1));
        assert(!linesReport.tested.includes(1));
        assert(linesReport.notHandled.includes(1));

        assert(linesReport.tested.includes(29));
        assert(linesReport.notTested.includes(53));

        assert(!linesReport.tested.includes(54));
        assert(!linesReport.notTested.includes(54));
    });

    test("Handle impossible line change", () => {
        assert.throws(() => coverReportFunc.moveLinesPercentages(data, 2, 1), Error, '"end line couldn\'t be inferior to start line."');
    });

    test("Changing middle line should move only some of the lines", () => {
        let linesReport = coverReportFunc.moveLinesPercentages(data, 20, 21);
        assert(!linesReport.notTested.includes(20));
        assert(!linesReport.tested.includes(20));
        assert(linesReport.notHandled.includes(20));

        assert(linesReport.tested.includes(16));
        assert(!linesReport.tested.includes(15));
        assert(!linesReport.notTested.includes(15));

        assert(linesReport.notTested.includes(53));
        assert(linesReport.tested.includes(52));
    });

    test("Editing multiple lines should move multiple lines", () => {
        let linesReport = coverReportFunc.moveLinesPercentages(data, 20, 26);
        assert(linesReport.notHandled.includes(20));
        assert(linesReport.notHandled.includes(21));
        assert(linesReport.notHandled.includes(22));
        assert(linesReport.notHandled.includes(23));
        assert(linesReport.notHandled.includes(24));
        assert(linesReport.notHandled.includes(25));

        assert(linesReport.tested.includes(16));
        assert(!linesReport.tested.includes(15));
        assert(!linesReport.notTested.includes(15));

        assert(linesReport.notTested.includes(58));
        assert(linesReport.tested.includes(57));
    });
});