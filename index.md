<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Software Engineering Metrics Capture Form</title>
<style>
  :root {
    --ink: #16202c;
    --muted: #5a6a7a;
    --rule: #d6dde5;
    --bg: #ffffff;
    --panel: #f6f8fa;
    --accent: #1f5fa9;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0 1rem 4rem;
    background: var(--bg);
    color: var(--ink);
    font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  header, main, footer { max-width: 46rem; margin: 0 auto; }
  header { padding: 2rem 0 1rem; border-bottom: 2px solid var(--ink); }
  h1 { margin: 0 0 .25rem; font-size: 1.75rem; }
  .lede { margin: .5rem 0; color: var(--muted); }
  nav { margin: 1.5rem 0; padding: 1rem; background: var(--panel); border: 1px solid var(--rule); border-radius: 6px; }
  nav h2 { margin: 0 0 .5rem; font-size: .8rem; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
  nav ol { margin: 0; padding-left: 1.25rem; }
  nav li { margin: .15rem 0; }
  nav a { color: var(--accent); }
  fieldset {
    margin: 2rem 0 0;
    padding: 1rem 1.25rem 1.25rem;
    border: 1px solid var(--rule);
    border-radius: 6px;
  }
  fieldset fieldset { margin-top: 1.25rem; background: var(--panel); }
  legend { padding: 0 .4rem; font-weight: 700; font-size: 1.05rem; }
  fieldset fieldset legend { font-size: .95rem; font-weight: 600; }
  .note {
    margin: .25rem 0 1rem;
    padding: .6rem .8rem;
    border-left: 3px solid var(--accent);
    background: var(--panel);
    color: var(--muted);
    font-size: .875rem;
  }
  .grid { display: block; }
  .field { display: flex; flex-direction: column; gap: .25rem; margin: 0 0 1rem; }
  .field.wide { display: flex; }
  label { font-weight: 600; font-size: .9rem; }
  .hint { color: var(--muted); font-size: .8rem; font-weight: 400; }
  input[type="text"], input[type="email"], input[type="url"], input[type="date"],
  input[type="number"], input[type="time"], select, textarea {
    width: 100%;
    padding: .45rem .55rem;
    border: 1px solid var(--rule);
    border-radius: 4px;
    background: #fff;
    color: inherit;
    font: inherit;
    font-size: .95rem;
  }
  textarea { min-height: 4.5rem; resize: vertical; }
  input:focus, select:focus, textarea:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
  .choices { display: flex; flex-direction: column; gap: .4rem; margin: .35rem 0 .5rem; }
  .choices label { font-weight: 400; display: inline-flex; align-items: center; gap: .35rem; }
  .required { color: #a3231f; }
  table { width: 100%; border-collapse: collapse; margin: .5rem 0 1rem; font-size: .9rem; }
  th, td { border: 1px solid var(--rule); padding: .4rem .5rem; text-align: left; vertical-align: middle; }
  th { background: var(--panel); font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; }
  td select, td input { margin: 0; }
  .actions { margin: 2rem 0 0; padding: 1.25rem; background: var(--panel); border: 1px solid var(--rule); border-radius: 6px; }
  button { padding: .6rem 1.25rem; font: inherit; font-weight: 600; border-radius: 4px; cursor: pointer; }
  button[type="submit"] { background: var(--accent); color: #fff; border: 1px solid var(--accent); }
  button[type="reset"] { background: #fff; color: var(--ink); border: 1px solid var(--rule); }
  footer { margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid var(--rule); color: var(--muted); font-size: .85rem; }
  a { color: var(--accent); }
  @media (prefers-color-scheme: dark) {
    :root { --ink: #e8edf2; --muted: #9fb0c0; --rule: #33404e; --bg: #131a21; --panel: #1b242d; --accent: #7fb2ee; }
    input[type="text"], input[type="email"], input[type="url"], input[type="date"],
    input[type="number"], input[type="time"], select, textarea { background: #0f1519; }
    button[type="reset"] { background: #0f1519; }
    button[type="submit"] { color: #0b1117; }
  }
</style>
</head>
<body>

<header>
  <h1>Software engineering metrics capture form</h1>
  <p class="lede">
    One reporting period, for one product, one team, or one topic. Complete
    only the sections that apply. Every figure should come from a named
    source system, and every speed or output figure should be reported
    alongside its quality guardrail.
  </p>
</header>

<main>

<nav aria-label="Form sections">
  <h2>Sections</h2>
  <ol>
    <li><a href="#scope">Scope and identification</a></li>
    <li><a href="#governance">Governance and guardrails</a></li>
    <li><a href="#flow">Flow metrics</a></li>
    <li><a href="#review">Pull request and code review</a></li>
    <li><a href="#dora">DORA delivery metrics</a></li>
    <li><a href="#devex">Developer experience: SPACE and DevEx</a></li>
    <li><a href="#quality">Code and quality</a></li>
    <li><a href="#product">Product and business outcomes</a></li>
    <li><a href="#reliability">Reliability, operations, security</a></li>
    <li><a href="#ai">AI-assisted development</a></li>
    <li><a href="#maturity">Maturity self-assessment</a></li>
    <li><a href="#closing">Caveats, exclusions, sign-off</a></li>
  </ol>
</nav>

<form action="/metrics/submissions" method="post" accept-charset="utf-8">

<!-- ============================================================ -->
<fieldset id="scope">
  <legend>1. Scope and identification</legend>
  <p class="note">
    A metric set is only comparable when its subject, period, and sources are
    stated explicitly. Two teams computing the same formula from different
    source systems will not produce comparable numbers.
  </p>

  <div class="field wide">
    <span id="subject-type-label" style="font-weight:600;font-size:.9rem">
      What is this submission about? <span class="required" aria-hidden="true">*</span>
    </span>
    <div class="choices" role="group" aria-labelledby="subject-type-label">
      <label><input type="radio" name="subject_type" value="product" required> A product</label>
      <label><input type="radio" name="subject_type" value="team"> A team</label>
      <label><input type="radio" name="subject_type" value="topic"> A topic or initiative</label>
      <label><input type="radio" name="subject_type" value="value_stream"> A value stream</label>
    </div>
  </div>

  <div class="grid">
    <div class="field">
      <label for="subject_name">Subject name <span class="required" aria-hidden="true">*</span></label>
      <input type="text" id="subject_name" name="subject_name" required
             placeholder="e.g. Payments API, Platform Team, Test flakiness">
    </div>
    <div class="field">
      <label for="subject_id">Subject identifier</label>
      <span class="hint" id="subject-id-hint">Stable key used in your systems.</span>
      <input type="text" id="subject_id" name="subject_id"
             aria-describedby="subject-id-hint" placeholder="e.g. svc-payments-api">
    </div>
    <div class="field">
      <label for="org_unit">Organization unit</label>
      <input type="text" id="org_unit" name="org_unit" placeholder="e.g. Core Platform">
    </div>
    <div class="field wide">
      <label for="subject_description">Short description</label>
      <textarea id="subject_description" name="subject_description"
                placeholder="What this product, team, or topic covers, in one or two sentences."></textarea>
    </div>

    <div class="field">
      <label for="reporter_name">Submitted by <span class="required" aria-hidden="true">*</span></label>
      <input type="text" id="reporter_name" name="reporter_name" required autocomplete="name">
    </div>
    <div class="field">
      <label for="reporter_email">Email <span class="required" aria-hidden="true">*</span></label>
      <input type="email" id="reporter_email" name="reporter_email" required autocomplete="email">
    </div>
    <div class="field">
      <label for="reporter_role">Role</label>
      <input type="text" id="reporter_role" name="reporter_role"
             placeholder="e.g. Engineering manager, SRE, Data owner">
    </div>
    <div class="field">
      <label for="metric_owner">Named metric owner</label>
      <span class="hint">The person accountable for these definitions.</span>
      <input type="text" id="metric_owner" name="metric_owner">
    </div>

    <div class="field">
      <label for="period_start">Reporting period start <span class="required" aria-hidden="true">*</span></label>
      <input type="date" id="period_start" name="period_start" required>
    </div>
    <div class="field">
      <label for="period_end">Reporting period end <span class="required" aria-hidden="true">*</span></label>
      <input type="date" id="period_end" name="period_end" required>
    </div>
    <div class="field">
      <label for="cadence">Reporting cadence</label>
      <select id="cadence" name="cadence">
        <option value="">Select a cadence</option>
        <option value="weekly">Weekly</option>
        <option value="fortnightly">Fortnightly</option>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="annually">Annually</option>
        <option value="ad-hoc">Ad hoc, one-off</option>
      </select>
    </div>
    <div class="field">
      <label for="team_size">Contributing engineers (headcount)</label>
      <input type="number" id="team_size" name="team_size" min="0" step="1" inputmode="numeric">
    </div>
  </div>

  <fieldset>
    <legend>Data sources and instrumentation</legend>
    <div class="field wide">
      <span id="sources-label" style="font-weight:600;font-size:.9rem">Source systems used (select all that apply)</span>
      <div class="choices" role="group" aria-labelledby="sources-label">
        <label><input type="checkbox" name="data_sources" value="issue_tracker"> Issue tracker</label>
        <label><input type="checkbox" name="data_sources" value="version_control"> Version control</label>
        <label><input type="checkbox" name="data_sources" value="ci_cd"> CI/CD pipeline</label>
        <label><input type="checkbox" name="data_sources" value="incident_management"> Incident management</label>
        <label><input type="checkbox" name="data_sources" value="observability"> Observability / APM</label>
        <label><input type="checkbox" name="data_sources" value="survey"> Survey platform</label>
        <label><input type="checkbox" name="data_sources" value="security_scanner"> Security scanner</label>
        <label><input type="checkbox" name="data_sources" value="product_analytics"> Product analytics</label>
        <label><input type="checkbox" name="data_sources" value="finance"> Finance / cost system</label>
        <label><input type="checkbox" name="data_sources" value="calendar"> Calendar data</label>
        <label><input type="checkbox" name="data_sources" value="manual"> Manual estimate or spreadsheet</label>
      </div>
    </div>
    <div class="grid">
      <div class="field">
        <label for="tooling">Primary tooling</label>
        <input type="text" id="tooling" name="tooling" list="tooling-options"
               placeholder="e.g. GitHub, Jira, Datadog">
        <datalist id="tooling-options">
          <option value="GitHub"></option>
          <option value="GitLab"></option>
          <option value="Bitbucket"></option>
          <option value="Jira"></option>
          <option value="Linear"></option>
          <option value="Azure DevOps"></option>
          <option value="Jenkins"></option>
          <option value="CircleCI"></option>
          <option value="Datadog"></option>
          <option value="Grafana"></option>
          <option value="PagerDuty"></option>
          <option value="Opsgenie"></option>
          <option value="Sentry"></option>
          <option value="SonarQube"></option>
          <option value="Snyk"></option>
          <option value="Amplitude"></option>
        </datalist>
      </div>
      <div class="field">
        <label for="collection_method">Collection method</label>
        <select id="collection_method" name="collection_method">
          <option value="">Select a method</option>
          <option value="automated">Fully automated instrumentation</option>
          <option value="semi_automated">Semi-automated, some manual steps</option>
          <option value="manual">Manual collection</option>
          <option value="estimate">Expert estimate, not measured</option>
        </select>
      </div>
      <div class="field">
        <label for="data_confidence">Confidence in this data</label>
        <select id="data_confidence" name="data_confidence">
          <option value="">Select a confidence level</option>
          <option value="high">High: verified against source systems</option>
          <option value="medium">Medium: spot-checked</option>
          <option value="low">Low: known gaps or unverified</option>
        </select>
      </div>
      <div class="field wide">
        <label for="source_notes">Source-of-truth notes</label>
        <textarea id="source_notes" name="source_notes"
                  placeholder="Which system is authoritative for each figure, and any known collection gaps."></textarea>
      </div>
    </div>
  </fieldset>
</fieldset>

<!-- ============================================================ -->
<fieldset id="governance">
  <legend>2. Governance and guardrails</legend>
  <p class="note">
    A measure that becomes a target stops being a good measure. Every
    incentivized metric needs a paired guardrail and a named gaming vector
    before it reaches a dashboard.
  </p>

  <div class="field wide">
    <span id="charter-label" style="font-weight:600;font-size:.9rem">Is there a written metrics charter for this subject?</span>
    <div class="choices" role="group" aria-labelledby="charter-label">
      <label><input type="radio" name="charter_exists" value="yes"> Yes</label>
      <label><input type="radio" name="charter_exists" value="in_progress"> In progress</label>
      <label><input type="radio" name="charter_exists" value="no"> No</label>
    </div>
  </div>

  <div class="grid">
    <div class="field">
      <label for="charter_url">Charter location</label>
      <input type="url" id="charter_url" name="charter_url" placeholder="https://">
    </div>
    <div class="field">
      <label for="dashboard_url">Dashboard location</label>
      <input type="url" id="dashboard_url" name="dashboard_url" placeholder="https://">
    </div>
    <div class="field">
      <label for="next_review">Next scheduled metric review</label>
      <input type="date" id="next_review" name="next_review">
    </div>
    <div class="field">
      <label for="metric_use">How is this metric set used?</label>
      <select id="metric_use" name="metric_use">
        <option value="">Select a classification</option>
        <option value="diagnostic">Diagnostic only: informs investigation</option>
        <option value="evaluative">Evaluative: informs judgement of performance</option>
        <option value="mixed">Mixed, documented per metric</option>
      </select>
    </div>
    <div class="field">
      <label for="metric_class">Input, output, or outcome weighting</label>
      <select id="metric_class" name="metric_class">
        <option value="">Select a weighting</option>
        <option value="outcome_weighted">Mostly outcome metrics</option>
        <option value="balanced">Balanced across input, output, outcome</option>
        <option value="output_weighted">Mostly output metrics</option>
        <option value="activity_weighted">Mostly activity metrics</option>
      </select>
    </div>
    <div class="field">
      <label for="statistic_convention">Statistical convention for time-based figures</label>
      <select id="statistic_convention" name="statistic_convention">
        <option value="">Select a convention</option>
        <option value="median_percentile">Median and percentiles</option>
        <option value="mean">Arithmetic mean</option>
        <option value="mixed">Mixed, noted per metric</option>
      </select>
    </div>

    <div class="field wide">
      <label for="decision_informed">What decision does this metric set inform?</label>
      <textarea id="decision_informed" name="decision_informed"
                placeholder="Name the specific decision. A metric that informs no decision is a candidate for retirement."></textarea>
    </div>
    <div class="field wide">
      <label for="non_goals">Explicit non-goals</label>
      <textarea id="non_goals" name="non_goals"
                placeholder="State what these numbers are not used for, e.g. individual performance evaluation or cross-team ranking without context."></textarea>
    </div>
    <div class="field wide">
      <label for="gaming_vectors">Named gaming vectors</label>
      <textarea id="gaming_vectors" name="gaming_vectors"
                placeholder="For each incentivized metric: how would a rational team make this number look good without doing better work?"></textarea>
    </div>
    <div class="field wide">
      <label for="guardrails">Paired guardrails</label>
      <textarea id="guardrails" name="guardrails"
                placeholder="e.g. deployment frequency paired with change failure rate; delivery speed paired with escaped defect rate."></textarea>
    </div>
  </div>

  <div class="field wide">
    <span id="checklist-label" style="font-weight:600;font-size:.9rem">New metric review checklist</span>
    <div class="choices" role="group" aria-labelledby="checklist-label">
      <label><input type="checkbox" name="governance_checklist" value="named_decision"> Every metric has a named decision it informs</label>
      <label><input type="checkbox" name="governance_checklist" value="classified"> Each metric is classified diagnostic or evaluative, in writing</label>
      <label><input type="checkbox" name="governance_checklist" value="guardrail_defined"> Guardrails defined for every incentivized metric</label>
      <label><input type="checkbox" name="governance_checklist" value="gaming_named"> Gaming vector named for each</label>
      <label><input type="checkbox" name="governance_checklist" value="owner_named"> Each metric has a named owner and documented source</label>
      <label><input type="checkbox" name="governance_checklist" value="percentiles"> Skewed time metrics use median or percentile, not average</label>
      <label><input type="checkbox" name="governance_checklist" value="not_individual"> Not used for individual evaluation</label>
      <label><input type="checkbox" name="governance_checklist" value="retired"> At least one metric retired in the last cycle if it stopped informing decisions</label>
    </div>
  </div>
</fieldset>

<!-- ============================================================ -->
<fieldset id="flow">
  <legend>3. Flow metrics</legend>
  <p class="note">
    Flow load = arrival rate x flow time (Little's law). Report velocity and
    distribution together; velocity alone says nothing about what kind of
    work is getting done.
  </p>

  <fieldset>
    <legend>Flow velocity and distribution</legend>
    <div class="grid">
      <div class="field">
        <label for="flow_velocity">Flow velocity: items completed</label>
        <input type="number" id="flow_velocity" name="flow_velocity" min="0" step="1">
      </div>
      <div class="field">
        <label for="flow_velocity_unit">Per unit of time</label>
        <select id="flow_velocity_unit" name="flow_velocity_unit">
          <option value="">Select a unit</option>
          <option value="day">Per day</option>
          <option value="week">Per week</option>
          <option value="sprint">Per sprint</option>
          <option value="month">Per month</option>
          <option value="quarter">Per quarter</option>
        </select>
      </div>
      <div class="field">
        <label for="flow_item_definition">Flow item definition</label>
        <span class="hint">What counts as one item, and when it is classified.</span>
        <input type="text" id="flow_item_definition" name="flow_item_definition">
      </div>
    </div>

    <p class="hint">
      Flow distribution: the share of completed items by type. The four
      percentages should total 100.
    </p>
    <div class="grid">
      <div class="field">
        <label for="dist_features">Features (%)</label>
        <input type="number" id="dist_features" name="dist_features" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="dist_defects">Defects (%)</label>
        <input type="number" id="dist_defects" name="dist_defects" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="dist_risks">Risks, including security and compliance (%)</label>
        <input type="number" id="dist_risks" name="dist_risks" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="dist_debt">Technical debt (%)</label>
        <input type="number" id="dist_debt" name="dist_debt" min="0" max="100" step="0.1">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Flow time, flow load, and efficiency</legend>
    <div class="grid">
      <div class="field">
        <label for="flow_time_median">Flow time, median (days)</label>
        <span class="hint">Entry to the value stream through to delivery.</span>
        <input type="number" id="flow_time_median" name="flow_time_median" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="flow_time_p90">Flow time, 90th percentile (days)</label>
        <input type="number" id="flow_time_p90" name="flow_time_p90" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="flow_load">Flow load: items active or waiting (count)</label>
        <input type="number" id="flow_load" name="flow_load" min="0" step="1">
      </div>
      <div class="field">
        <label for="wip_limit">Work-in-process limit, if set</label>
        <input type="number" id="wip_limit" name="wip_limit" min="0" step="1">
      </div>
      <div class="field">
        <label for="arrival_rate">Arrival rate (items per week)</label>
        <input type="number" id="arrival_rate" name="arrival_rate" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="flow_efficiency">Flow efficiency (%)</label>
        <span class="hint">Active work time / total elapsed time.</span>
        <input type="number" id="flow_efficiency" name="flow_efficiency" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="utilization">Utilization (%)</label>
        <span class="hint">Arrival rate / service rate, for shared resources.</span>
        <input type="number" id="utilization" name="utilization" min="0" max="200" step="0.1">
      </div>
      <div class="field">
        <label for="blocked_items">Items currently blocked (count)</label>
        <input type="number" id="blocked_items" name="blocked_items" min="0" step="1">
      </div>
      <div class="field">
        <label for="aging_items">Items older than the flow time 90th percentile</label>
        <input type="number" id="aging_items" name="aging_items" min="0" step="1">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Cycle time decomposition (hours per stage)</legend>
    <div class="grid">
      <div class="field">
        <label for="stage_coding">Coding time</label>
        <input type="number" id="stage_coding" name="stage_coding" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="stage_pickup">Pickup time</label>
        <input type="number" id="stage_pickup" name="stage_pickup" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="stage_review">Review time</label>
        <input type="number" id="stage_review" name="stage_review" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="stage_test">Test time</label>
        <input type="number" id="stage_test" name="stage_test" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="stage_deploy">Deploy time</label>
        <input type="number" id="stage_deploy" name="stage_deploy" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="cycle_time_total">Total cycle time, median (hours)</label>
        <input type="number" id="cycle_time_total" name="cycle_time_total" min="0" step="0.1">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Lean value stream metrics</legend>
    <div class="grid">
      <div class="field">
        <label for="pca">Percent complete and accurate, %C/A (%)</label>
        <span class="hint">Units usable downstream without rework.</span>
        <input type="number" id="pca" name="pca" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="rty">Rolled throughput yield (%)</label>
        <span class="hint">Product of %C/A across all stages.</span>
        <input type="number" id="rty" name="rty" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="takt_time">Takt time (hours per item)</label>
        <span class="hint">Available working time / customer demand.</span>
        <input type="number" id="takt_time" name="takt_time" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="handoffs">Handoffs per item (count)</label>
        <input type="number" id="handoffs" name="handoffs" min="0" step="1">
      </div>
      <div class="field wide">
        <label for="bottleneck">Identified bottleneck stage</label>
        <input type="text" id="bottleneck" name="bottleneck"
               placeholder="Which stage holds the largest queue, and what evidence points to it.">
      </div>
    </div>
  </fieldset>
</fieldset>

<!-- ============================================================ -->
<fieldset id="review">
  <legend>4. Pull request and code review metrics</legend>
  <p class="note">
    Review speed metrics need a quality guardrail. Faster reviews that catch
    less are not an improvement.
  </p>
  <div class="grid">
    <div class="field">
      <label for="prs_opened">Pull requests opened (count in period)</label>
      <input type="number" id="prs_opened" name="prs_opened" min="0" step="1">
    </div>
    <div class="field">
      <label for="prs_merged">Pull requests merged (count in period)</label>
      <input type="number" id="prs_merged" name="prs_merged" min="0" step="1">
    </div>
    <div class="field">
      <label for="ttfr_median">Time to first review, median (hours)</label>
      <span class="hint">Opened to first substantive reviewer response.</span>
      <input type="number" id="ttfr_median" name="ttfr_median" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="ttfr_p90">Time to first review, 90th percentile (hours)</label>
      <input type="number" id="ttfr_p90" name="ttfr_p90" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="review_duration_median">Review duration, median (hours)</label>
      <input type="number" id="review_duration_median" name="review_duration_median" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="pr_size_median">Pull request size, median (lines changed)</label>
      <input type="number" id="pr_size_median" name="pr_size_median" min="0" step="1">
    </div>
    <div class="field">
      <label for="reviewers_per_pr">Reviewers per pull request (mean)</label>
      <input type="number" id="reviewers_per_pr" name="reviewers_per_pr" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="review_iterations">Review iterations per pull request (median)</label>
      <input type="number" id="review_iterations" name="review_iterations" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="rubber_stamp_rate">Approvals with no comments (%)</label>
      <span class="hint">A gaming signal for review-speed targets.</span>
      <input type="number" id="rubber_stamp_rate" name="rubber_stamp_rate" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="stale_prs">Pull requests open longer than seven days</label>
      <input type="number" id="stale_prs" name="stale_prs" min="0" step="1">
    </div>
    <div class="field">
      <label for="review_participation">Review participation (% of engineers reviewing)</label>
      <input type="number" id="review_participation" name="review_participation" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="defects_caught_in_review">Defects caught in review (count)</label>
      <span class="hint">The quality guardrail for review speed.</span>
      <input type="number" id="defects_caught_in_review" name="defects_caught_in_review" min="0" step="1">
    </div>
  </div>
</fieldset>

<!-- ============================================================ -->
<fieldset id="dora">
  <legend>5. DORA delivery metrics</legend>
  <p class="note">
    The four DORA metrics are a system-level set. Report throughput
    (deployment frequency, lead time) alongside stability (change failure
    rate, recovery time), never one pair alone.
  </p>
  <div class="grid">
    <div class="field">
      <label for="deploy_count">Successful production deployments (count in period)</label>
      <input type="number" id="deploy_count" name="deploy_count" min="0" step="1">
    </div>
    <div class="field">
      <label for="deploy_frequency">Deployment frequency (deployments per unit)</label>
      <input type="number" id="deploy_frequency" name="deploy_frequency" min="0" step="0.01">
    </div>
    <div class="field">
      <label for="deploy_frequency_unit">Deployment frequency unit</label>
      <select id="deploy_frequency_unit" name="deploy_frequency_unit">
        <option value="">Select a unit</option>
        <option value="day">Per day</option>
        <option value="week">Per week</option>
        <option value="month">Per month</option>
      </select>
    </div>
    <div class="field">
      <label for="lead_time_median">Lead time for changes, median (hours)</label>
      <span class="hint">First commit to successful production deployment.</span>
      <input type="number" id="lead_time_median" name="lead_time_median" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="lead_time_p90">Lead time for changes, 90th percentile (hours)</label>
      <input type="number" id="lead_time_p90" name="lead_time_p90" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="failed_deploys">Deployments causing a failure (count)</label>
      <input type="number" id="failed_deploys" name="failed_deploys" min="0" step="1">
    </div>
    <div class="field">
      <label for="change_failure_rate">Change failure rate (%)</label>
      <input type="number" id="change_failure_rate" name="change_failure_rate" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="recovery_time_median">Failed deployment recovery time, median (hours)</label>
      <span class="hint">Failure detection to genuine service restoration.</span>
      <input type="number" id="recovery_time_median" name="recovery_time_median" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="recovery_time_p90">Failed deployment recovery time, 90th percentile (hours)</label>
      <input type="number" id="recovery_time_p90" name="recovery_time_p90" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="dora_band">Self-assessed performance band</label>
      <select id="dora_band" name="dora_band">
        <option value="">Select a band</option>
        <option value="elite">Elite</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
        <option value="unknown">Not assessed</option>
      </select>
    </div>
    <div class="field">
      <label for="rollback_count">Rollbacks or hotfixes (count)</label>
      <input type="number" id="rollback_count" name="rollback_count" min="0" step="1">
    </div>
    <div class="field">
      <label for="deploy_scope">What counts as a deployment here?</label>
      <input type="text" id="deploy_scope" name="deploy_scope"
             placeholder="e.g. any merge to main reaching production, excluding config-only changes">
    </div>
  </div>
</fieldset>

<!-- ============================================================ -->
<fieldset id="devex">
  <legend>6. Developer experience: SPACE and DevEx</legend>
  <p class="note">
    Use at least one metric from at least three SPACE dimensions, mixing
    subjective and objective signals. Activity metrics are the dimension most
    prone to misuse: never report them standalone, and never per individual.
  </p>

  <fieldset>
    <legend>Satisfaction and well-being</legend>
    <div class="grid">
      <div class="field">
        <label for="satisfaction_score">Developer satisfaction, mean (1&ndash;5)</label>
        <input type="number" id="satisfaction_score" name="satisfaction_score" min="1" max="5" step="0.1">
      </div>
      <div class="field">
        <label for="enps">Employee net promoter score (&minus;100 to 100)</label>
        <input type="number" id="enps" name="enps" min="-100" max="100" step="1">
      </div>
      <div class="field">
        <label for="burnout_risk">Respondents reporting burnout risk (%)</label>
        <input type="number" id="burnout_risk" name="burnout_risk" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="voluntary_attrition">Voluntary attrition over the period (%)</label>
        <input type="number" id="voluntary_attrition" name="voluntary_attrition" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="tooling_satisfaction">Satisfaction with tooling (1&ndash;5)</label>
        <input type="number" id="tooling_satisfaction" name="tooling_satisfaction" min="1" max="5" step="0.1">
      </div>
      <div class="field">
        <label for="docs_satisfaction">Satisfaction with documentation (1&ndash;5)</label>
        <input type="number" id="docs_satisfaction" name="docs_satisfaction" min="1" max="5" step="0.1">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Efficiency and flow: focus time and interruptions</legend>
    <div class="grid">
      <div class="field">
        <label for="focus_blocks">Uninterrupted blocks of two hours or more (per engineer per week)</label>
        <input type="number" id="focus_blocks" name="focus_blocks" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="focus_hours">Total focus hours (per engineer per week)</label>
        <input type="number" id="focus_hours" name="focus_hours" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="meeting_hours">Meeting hours (per engineer per week)</label>
        <input type="number" id="meeting_hours" name="meeting_hours" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="interruptions">Unplanned interruptions (per engineer per day)</label>
        <input type="number" id="interruptions" name="interruptions" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="context_switches">Concurrent work items per engineer (mean)</label>
        <input type="number" id="context_switches" name="context_switches" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="unplanned_work">Unplanned work as a share of capacity (%)</label>
        <input type="number" id="unplanned_work" name="unplanned_work" min="0" max="100" step="0.1">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Objective DevEx instrumentation</legend>
    <p class="hint">
      Pair every subjective response with the objective signal it refers to.
      Divergence between perception and measurement is itself worth
      investigating.
    </p>
    <div class="grid">
      <div class="field">
        <label for="build_time">Local build time, median (minutes)</label>
        <input type="number" id="build_time" name="build_time" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="test_suite_time">Full test suite run time (minutes)</label>
        <input type="number" id="test_suite_time" name="test_suite_time" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="ci_wait">CI queue wait, median (minutes)</label>
        <input type="number" id="ci_wait" name="ci_wait" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="onboarding_setup">Local environment setup time (hours)</label>
        <input type="number" id="onboarding_setup" name="onboarding_setup" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="time_to_first_commit">New joiner time to first merged change (days)</label>
        <input type="number" id="time_to_first_commit" name="time_to_first_commit" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="feedback_loop_time">Slowest routine feedback loop (minutes)</label>
        <input type="number" id="feedback_loop_time" name="feedback_loop_time" min="0" step="0.1">
      </div>
    </div>

    <p class="hint">DevEx dimensions, self-assessed on a five-point scale.</p>
    <div class="grid">
      <div class="field">
        <label for="devex_feedback">Feedback loops (1&ndash;5)</label>
        <select id="devex_feedback" name="devex_feedback">
          <option value="">Not assessed</option>
          <option value="1">1 &ndash; very poor</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5 &ndash; very good</option>
        </select>
      </div>
      <div class="field">
        <label for="devex_cognitive_load">Cognitive load (1&ndash;5, higher is better)</label>
        <select id="devex_cognitive_load" name="devex_cognitive_load">
          <option value="">Not assessed</option>
          <option value="1">1 &ndash; overwhelming</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5 &ndash; manageable</option>
        </select>
      </div>
      <div class="field">
        <label for="devex_flow_state">Flow state (1&ndash;5)</label>
        <select id="devex_flow_state" name="devex_flow_state">
          <option value="">Not assessed</option>
          <option value="1">1 &ndash; rarely achieved</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5 &ndash; routinely achieved</option>
        </select>
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Communication and collaboration</legend>
    <div class="grid">
      <div class="field">
        <label for="bus_factor">Bus factor</label>
        <span class="hint">People who would have to leave before a critical area is orphaned.</span>
        <input type="number" id="bus_factor" name="bus_factor" min="0" step="1">
      </div>
      <div class="field">
        <label for="knowledge_concentration">Files with a single dominant author (%)</label>
        <input type="number" id="knowledge_concentration" name="knowledge_concentration" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="cross_team_deps">Cross-team dependencies blocking work (count)</label>
        <input type="number" id="cross_team_deps" name="cross_team_deps" min="0" step="1">
      </div>
      <div class="field">
        <label for="onboarding_time">Time to full productivity for a new joiner (weeks)</label>
        <input type="number" id="onboarding_time" name="onboarding_time" min="0" step="0.5">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Survey mechanics</legend>
    <div class="grid">
      <div class="field">
        <label for="survey_date">Most recent survey closed on</label>
        <input type="date" id="survey_date" name="survey_date">
      </div>
      <div class="field">
        <label for="survey_invitations">Invitations sent</label>
        <input type="number" id="survey_invitations" name="survey_invitations" min="0" step="1">
      </div>
      <div class="field">
        <label for="survey_responses">Responses received</label>
        <input type="number" id="survey_responses" name="survey_responses" min="0" step="1">
      </div>
      <div class="field">
        <label for="response_rate">Response rate (%)</label>
        <span class="hint">A declining rate is itself a trust signal.</span>
        <input type="number" id="response_rate" name="response_rate" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="response_rate_trend">Response rate trend since last cycle</label>
        <select id="response_rate_trend" name="response_rate_trend">
          <option value="">Select a trend</option>
          <option value="rising">Rising</option>
          <option value="flat">Flat</option>
          <option value="falling">Falling</option>
          <option value="first_cycle">First cycle</option>
        </select>
      </div>
      <div class="field">
        <label for="survey_scale">Response scale used</label>
        <select id="survey_scale" name="survey_scale">
          <option value="">Select a scale</option>
          <option value="likert5">Five-point Likert</option>
          <option value="likert7">Seven-point Likert</option>
          <option value="binary">Binary</option>
          <option value="mixed">Mixed scales</option>
        </select>
      </div>
    </div>
    <div class="field wide">
      <span id="survey-practice-label" style="font-weight:600;font-size:.9rem">Survey design practices confirmed</span>
      <div class="choices" role="group" aria-labelledby="survey-practice-label">
        <label><input type="checkbox" name="survey_practices" value="anonymity"> Anonymity genuinely protected</label>
        <label><input type="checkbox" name="survey_practices" value="piloted"> New questions piloted before wide rollout</label>
        <label><input type="checkbox" name="survey_practices" value="single_barrelled"> No double-barrelled or leading questions</label>
        <label><input type="checkbox" name="survey_practices" value="consistent_scale"> Consistent scale across the instrument</label>
        <label><input type="checkbox" name="survey_practices" value="results_published"> Results published honestly, including unflattering ones</label>
        <label><input type="checkbox" name="survey_practices" value="loop_closed"> At least one concrete action taken and communicated</label>
      </div>
    </div>
    <div class="field wide">
      <label for="survey_action">Action taken in response to the last survey</label>
      <textarea id="survey_action" name="survey_action"
                placeholder="Name one concrete change made and communicated back to respondents."></textarea>
    </div>
  </fieldset>

  <fieldset>
    <legend>Activity metrics, for aggregate context only</legend>
    <p class="hint">
      Report these only in aggregate and only alongside outcome metrics.
      Never attribute them to an individual.
    </p>
    <div class="grid">
      <div class="field">
        <label for="commits_per_week">Commits per week (team total)</label>
        <input type="number" id="commits_per_week" name="commits_per_week" min="0" step="1">
      </div>
      <div class="field">
        <label for="active_contributors">Active contributors in period</label>
        <input type="number" id="active_contributors" name="active_contributors" min="0" step="1">
      </div>
    </div>
  </fieldset>
</fieldset>

<!-- ============================================================ -->
<fieldset id="quality">
  <legend>7. Code and quality metrics</legend>
  <div class="grid">
    <div class="field">
      <label for="cyclomatic_mean">Cyclomatic complexity, mean per function</label>
      <input type="number" id="cyclomatic_mean" name="cyclomatic_mean" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="cyclomatic_max">Cyclomatic complexity, maximum</label>
      <input type="number" id="cyclomatic_max" name="cyclomatic_max" min="0" step="1">
    </div>
    <div class="field">
      <label for="complexity_threshold_breaches">Functions above the agreed complexity threshold</label>
      <input type="number" id="complexity_threshold_breaches" name="complexity_threshold_breaches" min="0" step="1">
    </div>
    <div class="field">
      <label for="coverage_line">Test coverage, lines (%)</label>
      <input type="number" id="coverage_line" name="coverage_line" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="coverage_branch">Test coverage, branches (%)</label>
      <input type="number" id="coverage_branch" name="coverage_branch" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="mutation_kill_rate">Mutation kill rate (%)</label>
      <span class="hint">The effectiveness guardrail for coverage.</span>
      <input type="number" id="mutation_kill_rate" name="mutation_kill_rate" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="flaky_rate">Flaky test rate (%)</label>
      <input type="number" id="flaky_rate" name="flaky_rate" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="churn">Code churn (lines added, modified, deleted per week)</label>
      <input type="number" id="churn" name="churn" min="0" step="1">
    </div>
    <div class="field">
      <label for="hotspot_file">Top hotspot file</label>
      <span class="hint">Highest churn x complexity.</span>
      <input type="text" id="hotspot_file" name="hotspot_file" placeholder="path/to/file">
    </div>
    <div class="field">
      <label for="hotspot_score">Top hotspot score</label>
      <input type="number" id="hotspot_score" name="hotspot_score" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="static_critical">Static analysis issues, critical</label>
      <input type="number" id="static_critical" name="static_critical" min="0" step="1">
    </div>
    <div class="field">
      <label for="static_major">Static analysis issues, major</label>
      <input type="number" id="static_major" name="static_major" min="0" step="1">
    </div>
    <div class="field">
      <label for="static_minor">Static analysis issues, minor</label>
      <input type="number" id="static_minor" name="static_minor" min="0" step="1">
    </div>
    <div class="field">
      <label for="new_issues_per_kloc">New issues introduced per thousand lines changed</label>
      <input type="number" id="new_issues_per_kloc" name="new_issues_per_kloc" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="debt_ratio">Technical debt ratio (%)</label>
      <span class="hint">Estimated remediation cost / estimated development cost.</span>
      <input type="number" id="debt_ratio" name="debt_ratio" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="debt_carrying_cost">Debt carrying cost (per month)</label>
      <span class="hint">Ongoing cost of not fixing: slower related work, elevated defect risk.</span>
      <input type="number" id="debt_carrying_cost" name="debt_carrying_cost" min="0" step="1">
    </div>
    <div class="field">
      <label for="debt_capacity">Capacity allocated to debt reduction (%)</label>
      <input type="number" id="debt_capacity" name="debt_capacity" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="debt_items_open">Tracked debt items open (count)</label>
      <input type="number" id="debt_items_open" name="debt_items_open" min="0" step="1">
    </div>
    <div class="field">
      <label for="docs_coverage">Documentation coverage of key areas (%)</label>
      <input type="number" id="docs_coverage" name="docs_coverage" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="docs_staleness">Median age of documentation last update (days)</label>
      <input type="number" id="docs_staleness" name="docs_staleness" min="0" step="1">
    </div>
  </div>
</fieldset>

<!-- ============================================================ -->
<fieldset id="product">
  <legend>8. Product and business outcomes</legend>
  <p class="note">
    Outcome metrics are the point. Shipping is not the outcome; what the
    shipping changed for a user or for the business is.
  </p>

  <fieldset>
    <legend>Escaped defects and quality escapes</legend>
    <div class="grid">
      <div class="field">
        <label for="escaped_critical">Escaped defects, critical</label>
        <input type="number" id="escaped_critical" name="escaped_critical" min="0" step="1">
      </div>
      <div class="field">
        <label for="escaped_high">Escaped defects, high</label>
        <input type="number" id="escaped_high" name="escaped_high" min="0" step="1">
      </div>
      <div class="field">
        <label for="escaped_medium">Escaped defects, medium</label>
        <input type="number" id="escaped_medium" name="escaped_medium" min="0" step="1">
      </div>
      <div class="field">
        <label for="escaped_low">Escaped defects, low</label>
        <input type="number" id="escaped_low" name="escaped_low" min="0" step="1">
      </div>
      <div class="field">
        <label for="escaped_rate">Severity-weighted escaped defect rate</label>
        <input type="number" id="escaped_rate" name="escaped_rate" min="0" step="0.01">
      </div>
      <div class="field">
        <label for="escaped_rate_basis">Rate basis</label>
        <select id="escaped_rate_basis" name="escaped_rate_basis">
          <option value="">Select a basis</option>
          <option value="per_release">Per release</option>
          <option value="per_month">Per month</option>
          <option value="per_kloc">Per thousand lines changed</option>
          <option value="per_feature">Per feature delivered</option>
        </select>
      </div>
      <div class="field">
        <label for="defect_detection_stage">Where most defects are caught</label>
        <select id="defect_detection_stage" name="defect_detection_stage">
          <option value="">Select a stage</option>
          <option value="development">Development</option>
          <option value="code_review">Code review</option>
          <option value="automated_test">Automated test</option>
          <option value="manual_qa">Manual QA</option>
          <option value="staging">Staging</option>
          <option value="production">Production, reported by users</option>
        </select>
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Feature adoption</legend>
    <div class="grid">
      <div class="field">
        <label for="feature_name">Feature assessed</label>
        <input type="text" id="feature_name" name="feature_name">
      </div>
      <div class="field">
        <label for="target_audience">Target audience size (users)</label>
        <input type="number" id="target_audience" name="target_audience" min="0" step="1">
      </div>
      <div class="field">
        <label for="initial_adoption">Initial adoption (%)</label>
        <span class="hint">Users who tried it at least once / target audience.</span>
        <input type="number" id="initial_adoption" name="initial_adoption" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="retained_adoption">Retained adoption (%)</label>
        <span class="hint">Still using it after N weeks / users who initially tried it.</span>
        <input type="number" id="retained_adoption" name="retained_adoption" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="retention_window">Retention window, N (weeks)</label>
        <input type="number" id="retention_window" name="retention_window" min="1" step="1">
      </div>
      <div class="field">
        <label for="features_unused">Delivered features with negligible adoption (count)</label>
        <input type="number" id="features_unused" name="features_unused" min="0" step="1">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Customer and business outcomes</legend>
    <div class="grid">
      <div class="field">
        <label for="csat">Customer satisfaction, CSAT (1&ndash;5)</label>
        <input type="number" id="csat" name="csat" min="1" max="5" step="0.1">
      </div>
      <div class="field">
        <label for="nps">Net promoter score (&minus;100 to 100)</label>
        <input type="number" id="nps" name="nps" min="-100" max="100" step="1">
      </div>
      <div class="field">
        <label for="task_success">Task success rate (%)</label>
        <input type="number" id="task_success" name="task_success" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="support_tickets">Support tickets attributable to this subject</label>
        <input type="number" id="support_tickets" name="support_tickets" min="0" step="1">
      </div>
      <div class="field">
        <label for="customer_churn">Customer churn over the period (%)</label>
        <input type="number" id="customer_churn" name="customer_churn" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="revenue_impact">Revenue attributable or at risk</label>
        <input type="number" id="revenue_impact" name="revenue_impact" step="0.01">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Cost, unit economics, and return on investment</legend>
    <div class="grid">
      <div class="field">
        <label for="currency">Currency</label>
        <select id="currency" name="currency">
          <option value="">Select a currency</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="CAD">CAD</option>
          <option value="AUD">AUD</option>
          <option value="JPY">JPY</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="field">
        <label for="unit_cost">Unit cost</label>
        <span class="hint">Total cost (people, infrastructure, tooling) / meaningful unit.</span>
        <input type="number" id="unit_cost" name="unit_cost" min="0" step="0.01">
      </div>
      <div class="field">
        <label for="unit_basis">Unit basis</label>
        <select id="unit_basis" name="unit_basis">
          <option value="">Select a basis</option>
          <option value="per_customer">Per customer</option>
          <option value="per_transaction">Per transaction</option>
          <option value="per_request">Per thousand requests</option>
          <option value="per_active_user">Per monthly active user</option>
          <option value="per_feature">Per feature delivered</option>
        </select>
      </div>
      <div class="field">
        <label for="cost_people">Cost: people (per period)</label>
        <input type="number" id="cost_people" name="cost_people" min="0" step="0.01">
      </div>
      <div class="field">
        <label for="cost_infrastructure">Cost: infrastructure (per period)</label>
        <input type="number" id="cost_infrastructure" name="cost_infrastructure" min="0" step="0.01">
      </div>
      <div class="field">
        <label for="cost_tooling">Cost: tooling and licences (per period)</label>
        <input type="number" id="cost_tooling" name="cost_tooling" min="0" step="0.01">
      </div>
      <div class="field">
        <label for="tco">Total cost of ownership</label>
        <input type="number" id="tco" name="tco" min="0" step="0.01">
      </div>
      <div class="field">
        <label for="total_benefit">Total documented benefit</label>
        <input type="number" id="total_benefit" name="total_benefit" step="0.01">
      </div>
      <div class="field">
        <label for="roi_conservative">ROI, conservative case (%)</label>
        <input type="number" id="roi_conservative" name="roi_conservative" step="0.1">
      </div>
      <div class="field">
        <label for="roi_optimistic">ROI, optimistic case (%)</label>
        <input type="number" id="roi_optimistic" name="roi_optimistic" step="0.1">
      </div>
      <div class="field wide">
        <label for="roi_assumption">Key assumption driving the ROI range</label>
        <textarea id="roi_assumption" name="roi_assumption"
                  placeholder="Name the single assumption that most moves the number."></textarea>
      </div>
      <div class="field wide">
        <label for="roi_confounds">Confounds considered and ruled out</label>
        <textarea id="roi_confounds" name="roi_confounds"
                  placeholder="What else could explain the benefit, and why it was ruled out or accounted for."></textarea>
      </div>
    </div>
  </fieldset>
</fieldset>

<!-- ============================================================ -->
<fieldset id="reliability">
  <legend>9. Reliability, operations, and security</legend>

  <fieldset>
    <legend>Service level objectives and error budget</legend>
    <div class="grid">
      <div class="field">
        <label for="sli_name">Primary service level indicator</label>
        <input type="text" id="sli_name" name="sli_name"
               placeholder="e.g. successful requests over total requests">
      </div>
      <div class="field">
        <label for="slo_target">SLO target (%)</label>
        <input type="number" id="slo_target" name="slo_target" min="0" max="100" step="0.001">
      </div>
      <div class="field">
        <label for="slo_window">SLO window (days)</label>
        <input type="number" id="slo_window" name="slo_window" min="1" step="1">
      </div>
      <div class="field">
        <label for="slo_actual">SLI actual for the window (%)</label>
        <input type="number" id="slo_actual" name="slo_actual" min="0" max="100" step="0.001">
      </div>
      <div class="field">
        <label for="error_budget_minutes">Error budget allotted (minutes)</label>
        <span class="hint">(1 &minus; SLO target) x window.</span>
        <input type="number" id="error_budget_minutes" name="error_budget_minutes" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="error_budget_consumed">Error budget consumed (%)</label>
        <input type="number" id="error_budget_consumed" name="error_budget_consumed" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="burn_rate">Error budget burn rate</label>
        <span class="hint">Budget consumed / budget allotted over the window.</span>
        <input type="number" id="burn_rate" name="burn_rate" min="0" step="0.01">
      </div>
      <div class="field">
        <label for="availability">Availability (%)</label>
        <input type="number" id="availability" name="availability" min="0" max="100" step="0.001">
      </div>
      <div class="field">
        <label for="latency_p50">Latency, p50 (ms)</label>
        <input type="number" id="latency_p50" name="latency_p50" min="0" step="1">
      </div>
      <div class="field">
        <label for="latency_p95">Latency, p95 (ms)</label>
        <input type="number" id="latency_p95" name="latency_p95" min="0" step="1">
      </div>
      <div class="field">
        <label for="latency_p99">Latency, p99 (ms)</label>
        <input type="number" id="latency_p99" name="latency_p99" min="0" step="1">
      </div>
      <div class="field">
        <label for="error_rate">Error rate (%)</label>
        <input type="number" id="error_rate" name="error_rate" min="0" max="100" step="0.001">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Incidents: detection, response, recovery</legend>
    <div class="grid">
      <div class="field">
        <label for="incidents_sev1">Incidents, severity 1</label>
        <input type="number" id="incidents_sev1" name="incidents_sev1" min="0" step="1">
      </div>
      <div class="field">
        <label for="incidents_sev2">Incidents, severity 2</label>
        <input type="number" id="incidents_sev2" name="incidents_sev2" min="0" step="1">
      </div>
      <div class="field">
        <label for="incidents_sev3">Incidents, severity 3</label>
        <input type="number" id="incidents_sev3" name="incidents_sev3" min="0" step="1">
      </div>
      <div class="field">
        <label for="incidents_sev4">Incidents, severity 4 and below</label>
        <input type="number" id="incidents_sev4" name="incidents_sev4" min="0" step="1">
      </div>
      <div class="field">
        <label for="mttd_median">MTTD, median (minutes)</label>
        <span class="hint">Incident onset to detection.</span>
        <input type="number" id="mttd_median" name="mttd_median" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="mtta_median">MTTA, median (minutes)</label>
        <span class="hint">Notification to acknowledgement.</span>
        <input type="number" id="mtta_median" name="mtta_median" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="mttr_median">MTTR, median (minutes)</label>
        <span class="hint">Acknowledgement to genuine service restoration.</span>
        <input type="number" id="mttr_median" name="mttr_median" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="mttr_p90">MTTR, 90th percentile (minutes)</label>
        <input type="number" id="mttr_p90" name="mttr_p90" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="customer_reported">Incidents first reported by customers (%)</label>
        <span class="hint">The honesty check on detection coverage.</span>
        <input type="number" id="customer_reported" name="customer_reported" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="postmortems_completed">Postmortems completed for qualifying incidents (%)</label>
        <input type="number" id="postmortems_completed" name="postmortems_completed" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="action_items_closed">Postmortem action items closed on time (%)</label>
        <input type="number" id="action_items_closed" name="action_items_closed" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="repeat_incidents">Repeat incidents with the same root cause</label>
        <input type="number" id="repeat_incidents" name="repeat_incidents" min="0" step="1">
      </div>
    </div>
    <div class="field wide">
      <span id="postmortem-label" style="font-weight:600;font-size:.9rem">Postmortem practice</span>
      <div class="choices" role="group" aria-labelledby="postmortem-label">
        <label><input type="checkbox" name="postmortem_practices" value="blameless"> Investigates the system, not the individual</label>
        <label><input type="checkbox" name="postmortem_practices" value="documented_severity"> Severity classified against documented criteria</label>
        <label><input type="checkbox" name="postmortem_practices" value="times_recorded"> Detection, acknowledgement, and resolution times recorded</label>
        <label><input type="checkbox" name="postmortem_practices" value="actions_tracked"> Action items specific, assigned, and tracked to completion</label>
        <label><input type="checkbox" name="postmortem_practices" value="shared_openly"> Shared without fear of individual consequence</label>
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>On-call, capacity, and operational load</legend>
    <div class="grid">
      <div class="field">
        <label for="pages_total">Pages in the period (total)</label>
        <input type="number" id="pages_total" name="pages_total" min="0" step="1">
      </div>
      <div class="field">
        <label for="pages_max_individual">Pages received by the most-paged individual</label>
        <span class="hint">Report the distribution, not the team average.</span>
        <input type="number" id="pages_max_individual" name="pages_max_individual" min="0" step="1">
      </div>
      <div class="field">
        <label for="pages_out_of_hours">Pages outside working hours (%)</label>
        <input type="number" id="pages_out_of_hours" name="pages_out_of_hours" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="pages_actionable">Pages that were actionable (%)</label>
        <span class="hint">The guardrail against alert fatigue.</span>
        <input type="number" id="pages_actionable" name="pages_actionable" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="toil_percentage">Time spent on toil (%)</label>
        <input type="number" id="toil_percentage" name="toil_percentage" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="oncall_rotation_size">On-call rotation size (people)</label>
        <input type="number" id="oncall_rotation_size" name="oncall_rotation_size" min="0" step="1">
      </div>
    </div>
  </fieldset>

  <fieldset>
    <legend>Security and vulnerability management</legend>
    <p class="hint">
      Time-to-remediate by severity matters more than a raw open-vulnerability
      count. Track remediation against explicit targets per severity.
    </p>
    <div class="grid">
      <div class="field">
        <label for="vuln_open_critical">Open vulnerabilities, critical</label>
        <input type="number" id="vuln_open_critical" name="vuln_open_critical" min="0" step="1">
      </div>
      <div class="field">
        <label for="vuln_open_high">Open vulnerabilities, high</label>
        <input type="number" id="vuln_open_high" name="vuln_open_high" min="0" step="1">
      </div>
      <div class="field">
        <label for="vuln_open_medium">Open vulnerabilities, medium</label>
        <input type="number" id="vuln_open_medium" name="vuln_open_medium" min="0" step="1">
      </div>
      <div class="field">
        <label for="vuln_open_low">Open vulnerabilities, low</label>
        <input type="number" id="vuln_open_low" name="vuln_open_low" min="0" step="1">
      </div>
      <div class="field">
        <label for="ttr_critical">Time to remediate, critical: median (days)</label>
        <input type="number" id="ttr_critical" name="ttr_critical" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="ttr_high">Time to remediate, high: median (days)</label>
        <input type="number" id="ttr_high" name="ttr_high" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="ttr_target_critical">Remediation target, critical (days)</label>
        <input type="number" id="ttr_target_critical" name="ttr_target_critical" min="0" step="0.1">
      </div>
      <div class="field">
        <label for="ttr_within_target">Vulnerabilities remediated within target (%)</label>
        <input type="number" id="ttr_within_target" name="ttr_within_target" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="vuln_oldest">Age of the oldest open critical vulnerability (days)</label>
        <input type="number" id="vuln_oldest" name="vuln_oldest" min="0" step="1">
      </div>
      <div class="field">
        <label for="scan_coverage">Scanner coverage of repositories and services (%)</label>
        <input type="number" id="scan_coverage" name="scan_coverage" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="security_debt_capacity">Protected capacity for security debt (%)</label>
        <input type="number" id="security_debt_capacity" name="security_debt_capacity" min="0" max="100" step="0.1">
      </div>
      <div class="field">
        <label for="accepted_risks">Formally accepted risks (count)</label>
        <span class="hint">Items consciously not remediated, made visible and quantified.</span>
        <input type="number" id="accepted_risks" name="accepted_risks" min="0" step="1">
      </div>
    </div>
    <div class="field wide">
      <span id="security-practice-label" style="font-weight:600;font-size:.9rem">Security practice</span>
      <div class="choices" role="group" aria-labelledby="security-practice-label">
        <label><input type="checkbox" name="security_practices" value="exposure_weighted"> Prioritization accounts for actual exposure, not severity score alone</label>
        <label><input type="checkbox" name="security_practices" value="same_backlog"> Security work competes on the same explicit backlog as other work</label>
        <label><input type="checkbox" name="security_practices" value="targets_by_severity"> Explicit remediation-time targets set per severity</label>
      </div>
    </div>
  </fieldset>
</fieldset>

<!-- ============================================================ -->
<fieldset id="ai">
  <legend>10. AI-assisted development</legend>
  <p class="note">
    Measure AI assistance by outcome, not by output volume or vendor-reported
    usage. Account for the full cycle, including review and correction time,
    and segment by task type: a single blended number hides where value
    actually concentrates.
  </p>
  <div class="grid">
    <div class="field wide">
      <span id="ai-tools-label" style="font-weight:600;font-size:.9rem">AI assistance in use</span>
      <div class="choices" role="group" aria-labelledby="ai-tools-label">
        <label><input type="checkbox" name="ai_usage" value="code_completion"> Inline code completion</label>
        <label><input type="checkbox" name="ai_usage" value="chat_assistant"> Chat assistant</label>
        <label><input type="checkbox" name="ai_usage" value="agentic"> Agentic coding tools</label>
        <label><input type="checkbox" name="ai_usage" value="code_review"> AI-assisted code review</label>
        <label><input type="checkbox" name="ai_usage" value="test_generation"> Test generation</label>
        <label><input type="checkbox" name="ai_usage" value="documentation"> Documentation generation</label>
        <label><input type="checkbox" name="ai_usage" value="incident_triage"> Incident triage or summarization</label>
        <label><input type="checkbox" name="ai_usage" value="none"> None in this period</label>
      </div>
    </div>
    <div class="field">
      <label for="ai_access">Engineers with access to AI tooling (%)</label>
      <input type="number" id="ai_access" name="ai_access" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="ai_assisted_changes">Merged changes with AI assistance (%)</label>
      <input type="number" id="ai_assisted_changes" name="ai_assisted_changes" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="ai_measurement_design">Measurement design used</label>
      <select id="ai_measurement_design" name="ai_measurement_design">
        <option value="">Select a design</option>
        <option value="none">No measurement, anecdote only</option>
        <option value="self_report">Self-reported time savings only</option>
        <option value="before_after">Before-and-after comparison</option>
        <option value="comparison_group">Genuine comparison group</option>
        <option value="task_segmented">Task-segmented outcome measurement</option>
      </select>
    </div>
    <div class="field">
      <label for="ai_self_reported_savings">Self-reported time saved (hours per engineer per week)</label>
      <span class="hint">A weak signal alone. Pair with measured cycle time.</span>
      <input type="number" id="ai_self_reported_savings" name="ai_self_reported_savings" min="0" step="0.1">
    </div>
    <div class="field">
      <label for="ai_cycle_time_change">Change in end-to-end cycle time (%)</label>
      <span class="hint">Negative means faster. Must include review and correction time.</span>
      <input type="number" id="ai_cycle_time_change" name="ai_cycle_time_change" step="0.1">
    </div>
    <div class="field">
      <label for="ai_review_time_change">Change in review time per change (%)</label>
      <input type="number" id="ai_review_time_change" name="ai_review_time_change" step="0.1">
    </div>
    <div class="field">
      <label for="ai_rework_rate">AI-assisted changes requiring significant rework (%)</label>
      <input type="number" id="ai_rework_rate" name="ai_rework_rate" min="0" max="100" step="0.1">
    </div>
    <div class="field">
      <label for="ai_cfr_change">Change in change failure rate (percentage points)</label>
      <input type="number" id="ai_cfr_change" name="ai_cfr_change" step="0.1">
    </div>
    <div class="field">
      <label for="ai_escaped_defect_change">Change in escaped defect rate (%)</label>
      <input type="number" id="ai_escaped_defect_change" name="ai_escaped_defect_change" step="0.1">
    </div>
    <div class="field">
      <label for="ai_review_capacity">Review capacity strain</label>
      <select id="ai_review_capacity" name="ai_review_capacity">
        <option value="">Select an assessment</option>
        <option value="unchanged">Unchanged</option>
        <option value="rising">Rising: review is becoming the bottleneck</option>
        <option value="strained">Strained: review depth is visibly dropping</option>
        <option value="not_tracked">Not tracked</option>
      </select>
    </div>
    <div class="field">
      <label for="ai_tool_cost">AI tooling cost (per period)</label>
      <input type="number" id="ai_tool_cost" name="ai_tool_cost" min="0" step="0.01">
    </div>
    <div class="field wide">
      <label for="ai_task_segments">Task segments measured, and where value concentrates</label>
      <textarea id="ai_task_segments" name="ai_task_segments"
                placeholder="e.g. boilerplate and test scaffolding show large gains; novel domain logic shows none."></textarea>
    </div>
    <div class="field wide">
      <label for="ai_comparison_group">Comparison group or baseline description</label>
      <textarea id="ai_comparison_group" name="ai_comparison_group"
                placeholder="How the comparison was constructed, and what industry-wide trends could confound it."></textarea>
    </div>
  </div>
  <div class="field wide">
    <span id="ai-audit-label" style="font-weight:600;font-size:.9rem">AI-era metric audit checklist</span>
    <div class="choices" role="group" aria-labelledby="ai-audit-label">
      <label><input type="checkbox" name="ai_audit" value="inflation_tested"> Each dashboard metric tested against: would heavy AI use inflate this without better outcomes?</label>
      <label><input type="checkbox" name="ai_audit" value="cfr_reviewed"> Change failure rate and defect rate reviewed alongside any rise in output volume</label>
      <label><input type="checkbox" name="ai_audit" value="review_monitored"> Review capacity and depth monitored as AI-generated volume grows</label>
      <label><input type="checkbox" name="ai_audit" value="defects_tagged"> Escaped defects tagged by AI-assistance level, to test rather than assume the link</label>
      <label><input type="checkbox" name="ai_audit" value="detection_hardened"> Detection methods resistant to plausible-looking defects, such as mutation testing</label>
      <label><input type="checkbox" name="ai_audit" value="charter_updated"> Metrics charter explicitly revisited for the AI era</label>
    </div>
  </div>
</fieldset>

<!-- ============================================================ -->
<fieldset id="maturity">
  <legend>11. Maturity self-assessment</legend>
  <p class="note">
    Score against concrete evidence, not intention. Programme maturity is the
    minimum across dimensions, not the average. Levels: 1 Initiate,
    2 Develop, 3 Standardize, 4 Manage, 5 Orchestrate.
  </p>

  <table>
    <caption class="hint" style="text-align:left;padding-bottom:.4rem">
      Score each capability from 1 to 5, or leave blank if not assessed.
    </caption>
    <thead>
      <tr>
        <th scope="col">Part</th>
        <th scope="col">Capability</th>
        <th scope="col" style="width:12rem">Score</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td><label for="maturity_p1">Foundations: governance, instrumentation, statistical literacy</label></td>
        <td>
          <select id="maturity_p1" name="maturity_p1">
            <option value="">Not assessed</option>
            <option value="1">1 &ndash; Initiate</option>
            <option value="2">2 &ndash; Develop</option>
            <option value="3">3 &ndash; Standardize</option>
            <option value="4">4 &ndash; Manage</option>
            <option value="5">5 &ndash; Orchestrate</option>
          </select>
        </td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td><label for="maturity_p2">Flow metrics: value stream, flow time, DORA adoption</label></td>
        <td>
          <select id="maturity_p2" name="maturity_p2">
            <option value="">Not assessed</option>
            <option value="1">1 &ndash; Initiate</option>
            <option value="2">2 &ndash; Develop</option>
            <option value="3">3 &ndash; Standardize</option>
            <option value="4">4 &ndash; Manage</option>
            <option value="5">5 &ndash; Orchestrate</option>
          </select>
        </td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td><label for="maturity_p3">Developer experience: SPACE balance, survey rigor, focus time</label></td>
        <td>
          <select id="maturity_p3" name="maturity_p3">
            <option value="">Not assessed</option>
            <option value="1">1 &ndash; Initiate</option>
            <option value="2">2 &ndash; Develop</option>
            <option value="3">3 &ndash; Standardize</option>
            <option value="4">4 &ndash; Manage</option>
            <option value="5">5 &ndash; Orchestrate</option>
          </select>
        </td>
      </tr>
      <tr>
        <th scope="row">4</th>
        <td><label for="maturity_p4">Code and quality: complexity, test effectiveness, debt measurement</label></td>
        <td>
          <select id="maturity_p4" name="maturity_p4">
            <option value="">Not assessed</option>
            <option value="1">1 &ndash; Initiate</option>
            <option value="2">2 &ndash; Develop</option>
            <option value="3">3 &ndash; Standardize</option>
            <option value="4">4 &ndash; Manage</option>
            <option value="5">5 &ndash; Orchestrate</option>
          </select>
        </td>
      </tr>
      <tr>
        <th scope="row">5</th>
        <td><label for="maturity_p5">Product and business: escaped defects, adoption, unit economics</label></td>
        <td>
          <select id="maturity_p5" name="maturity_p5">
            <option value="">Not assessed</option>
            <option value="1">1 &ndash; Initiate</option>
            <option value="2">2 &ndash; Develop</option>
            <option value="3">3 &ndash; Standardize</option>
            <option value="4">4 &ndash; Manage</option>
            <option value="5">5 &ndash; Orchestrate</option>
          </select>
        </td>
      </tr>
      <tr>
        <th scope="row">6</th>
        <td><label for="maturity_p6">Reliability and security: SLOs, incident metrics, remediation discipline</label></td>
        <td>
          <select id="maturity_p6" name="maturity_p6">
            <option value="">Not assessed</option>
            <option value="1">1 &ndash; Initiate</option>
            <option value="2">2 &ndash; Develop</option>
            <option value="3">3 &ndash; Standardize</option>
            <option value="4">4 &ndash; Manage</option>
            <option value="5">5 &ndash; Orchestrate</option>
          </select>
        </td>
      </tr>
      <tr>
        <th scope="row">7</th>
        <td><label for="maturity_p7">AI era: evidence-based assessment of AI-assisted development</label></td>
        <td>
          <select id="maturity_p7" name="maturity_p7">
            <option value="">Not assessed</option>
            <option value="1">1 &ndash; Initiate</option>
            <option value="2">2 &ndash; Develop</option>
            <option value="3">3 &ndash; Standardize</option>
            <option value="4">4 &ndash; Manage</option>
            <option value="5">5 &ndash; Orchestrate</option>
          </select>
        </td>
      </tr>
      <tr>
        <th scope="row">8</th>
        <td><label for="maturity_p8">Programme: dashboards, rollout, adoption roadmap</label></td>
        <td>
          <select id="maturity_p8" name="maturity_p8">
            <option value="">Not assessed</option>
            <option value="1">1 &ndash; Initiate</option>
            <option value="2">2 &ndash; Develop</option>
            <option value="3">3 &ndash; Standardize</option>
            <option value="4">4 &ndash; Manage</option>
            <option value="5">5 &ndash; Orchestrate</option>
          </select>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="grid">
    <div class="field">
      <label for="maturity_overall">Overall programme maturity</label>
      <span class="hint">The minimum across dimensions, not the average.</span>
      <select id="maturity_overall" name="maturity_overall">
        <option value="">Not assessed</option>
        <option value="1">1 &ndash; Initiate</option>
        <option value="2">2 &ndash; Develop</option>
        <option value="3">3 &ndash; Standardize</option>
        <option value="4">4 &ndash; Manage</option>
        <option value="5">5 &ndash; Orchestrate</option>
      </select>
    </div>
    <div class="field wide">
      <label for="maturity_evidence">Evidence supporting these scores</label>
      <textarea id="maturity_evidence" name="maturity_evidence"
                placeholder="What concrete artefacts or observations justify each score."></textarea>
    </div>
    <div class="field wide">
      <label for="improvement_priority">Lowest-scoring capability to invest in next</label>
      <textarea id="improvement_priority" name="improvement_priority"
                placeholder="Feed low scores into the adoption roadmap as investment priorities, not as a verdict."></textarea>
    </div>
  </div>
</fieldset>

<!-- ============================================================ -->
<fieldset id="closing">
  <legend>12. Caveats, exclusions, and sign-off</legend>
  <div class="grid">
    <div class="field wide">
      <label for="notable_changes">Movement outside normal variation</label>
      <textarea id="notable_changes" name="notable_changes"
                placeholder="Which readings moved beyond normal variation this period, and what is known about why."></textarea>
    </div>
    <div class="field wide">
      <label for="deliberate_exclusions">What this submission deliberately excludes</label>
      <textarea id="deliberate_exclusions" name="deliberate_exclusions"
                placeholder="Name anything intentionally left off and why, for example individual activity counts."></textarea>
    </div>
    <div class="field wide">
      <label for="caveats">Caveats and known data quality issues</label>
      <textarea id="caveats" name="caveats"
                placeholder="Definition changes, pipeline gaps, partial periods, or anything that makes a figure less comparable than it looks."></textarea>
    </div>
    <div class="field wide">
      <label for="definition_changes">Definition changes since the last submission</label>
      <textarea id="definition_changes" name="definition_changes"
                placeholder="Any changed formula, source system, or scope, which breaks comparability with earlier periods."></textarea>
    </div>
    <div class="field wide">
      <label for="metrics_retired">Metrics proposed for retirement</label>
      <textarea id="metrics_retired" name="metrics_retired"
                placeholder="Which metrics have not informed a decision in the last two cycles."></textarea>
    </div>
    <div class="field wide">
      <label for="additional_notes">Anything else</label>
      <textarea id="additional_notes" name="additional_notes"></textarea>
    </div>
  </div>

  <div class="field wide">
    <span id="attestation-label" style="font-weight:600;font-size:.9rem">Attestation</span>
    <div class="choices" role="group" aria-labelledby="attestation-label">
      <label><input type="checkbox" name="attestation" value="verified"> These figures were taken from the named source systems, not estimated, except where stated</label>
      <label><input type="checkbox" name="attestation" value="not_individual"> No figure here is attributed to an identifiable individual</label>
      <label><input type="checkbox" name="attestation" value="guardrails_present"> Every speed or output figure is reported alongside its guardrail</label>
    </div>
  </div>

  <div class="grid">
    <div class="field">
      <label for="submission_date">Submission date</label>
      <input type="date" id="submission_date" name="submission_date">
    </div>
    <div class="field">
      <label for="submission_status">Submission status</label>
      <select id="submission_status" name="submission_status">
        <option value="draft">Draft</option>
        <option value="for_review">Ready for review</option>
        <option value="final">Final</option>
      </select>
    </div>
  </div>
</fieldset>

<div class="actions">
  <button type="submit" name="action" value="submit">Submit metrics</button>
  <button type="reset">Clear the form</button>
</div>

</form>

</main>

<footer>
  <p>
    Field definitions follow
    <a href="https://software-engineering-metrics.github.io/">Software Engineering Metrics</a>,
    in particular the metric definitions and formulas reference, the
    checklists, and the maturity self-assessment appendices.
  </p>
</footer>

</body>
</html>
