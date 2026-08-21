// The questions on the form, in the order they are asked.
//
// This list is the single source of truth: it drives the rendered form and
// the TSV column order together, so the two cannot drift apart. Adding a
// question here adds it to the export, with no second edit to remember.

export type FieldKind =
  | 'email'
  | 'text'
  | 'url'
  | 'date'
  | 'datetime-local'
  | 'select'
  | 'textarea'
  | 'number'
  | 'radio'
  | 'checkbox';

export interface Choice {
  value: string;
  label: string;
}

export interface FieldSpec {
  /** Column name in the export, and key in browser storage. */
  name: string;
  /** Visible question text. */
  label: string;
  kind: FieldKind;
  required?: boolean;
  /** Starting answer, for a question whose choices have no blank option. */
  initial?: string;
  placeholder?: string;
  /** Guidance shown under the question. */
  hint?: string;
  /** Choices for select, radio, and checkbox questions. */
  choices?: Choice[];
  /** Bounds for number questions. */
  min?: number;
  max?: number;
  step?: number;
}

/** A run of related questions inside a section, optionally under a legend. */
export interface GroupSpec {
  legend?: string;
  /** Guidance shown above the group's questions. */
  note?: string;
  fields: FieldSpec[];
}

export interface SectionSpec {
  title: string;
  /** Why the section is asked, shown above its questions. */
  note?: string;
  groups: GroupSpec[];
}

const MATURITY_LEVELS: Choice[] = [
  { value: '', label: 'Not assessed' },
  { value: '1', label: '1 \u2013 Initiate' },
  { value: '2', label: '2 \u2013 Develop' },
  { value: '3', label: '3 \u2013 Standardize' },
  { value: '4', label: '4 \u2013 Manage' },
  { value: '5', label: '5 \u2013 Orchestrate' }
];

const PER_UNIT: Choice[] = [
  { value: '', label: 'Select a unit' },
  { value: 'day', label: 'Per day' },
  { value: 'week', label: 'Per week' },
  { value: 'sprint', label: 'Per sprint' },
  { value: 'month', label: 'Per month' },
  { value: 'quarter', label: 'Per quarter' }
];

export const sections: SectionSpec[] = [
  {
    title: 'Scope',
    groups: [
      {
        fields: [
          {
            name: 'email',
            label: 'Your email address?',
            kind: 'email',
            required: true,
            placeholder: 'ann.adams@example.com'
          },
          {
            name: 'which_organization',
            label: 'Which organization / office / outfit / etc.?',
            kind: 'text',
            required: true,
            placeholder: 'ACME Incorporated'
          },
          {
            name: 'which_department',
            label: 'Which department / division / directorate / etc.?',
            kind: 'text',
            required: true,
            placeholder: 'Production Department'
          },
          {
            name: 'which_plan',
            label: 'Which plan / project / product / practice / etc.?',
            kind: 'text',
            required: true,
            placeholder: 'Phoenix Project'
          },
          {
            name: 'which_task',
            label: 'Which task / todo / topic / etc.?',
            kind: 'text',
            required: true,
            placeholder: 'Implement Feature X'
          },
          {
            name: 'which_stage',
            label: 'Which phase / stage / queue / etc.?',
            kind: 'text',
            required: true,
            placeholder: 'User Acceptance Testing'
          },
          {
            name: 'which_status',
            label: 'What status / step / change / etc.?',
            kind: 'text',
            required: true,
            placeholder: 'Start'
          },
          {
            name: 'when',
            label: 'When is this occurring?',
            kind: 'datetime-local',
            required: true
          },
          {
            name: 'collection_method',
            label: 'Collection method?',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a method' },
              { value: 'estimate', label: 'Estimate' },
              { value: 'manual', label: 'Manual collection' },
              { value: 'assisted', label: 'Assisted collection (some manual, some automated)' },
              { value: 'automated', label: 'Automated collection' }
            ]
          },
          {
            name: 'confidence',
            label: 'Confidence in this information?',
            kind: 'select',
            choices: [
              { value: '', label: '' },
              { value: 'low', label: 'Low: known gaps, or unverified, etc.' },
              { value: 'medium', label: 'Medium: spot-checked, or some proofing, etc.' },
              { value: 'high', label: 'High: verified, or audited, or confirmed, etc.' }
            ]
          },
          {
            name: 'source_notes',
            label: 'Any source-of-truth notes?',
            kind: 'textarea'
          }
        ]
      }
    ]
  },
  {
    title: 'Governance and guardrails',
    note:
      'A measure that becomes a target stops being a good measure. Every ' +
      'incentivized metric needs a paired guardrail and a named gaming vector ' +
      'before it reaches a dashboard.',
    groups: [
      {
        fields: [
          {
            name: 'charter_exists',
            label: 'Is there a written metrics charter for this subject?',
            kind: 'radio',
            choices: [
              { value: 'yes', label: 'Yes' },
              { value: 'in_progress', label: 'In progress' },
              { value: 'no', label: 'No' }
            ]
          },
          {
            name: 'charter_url',
            label: 'Charter location',
            kind: 'url',
            placeholder: 'https://'
          },
          {
            name: 'dashboard_url',
            label: 'Dashboard location',
            kind: 'url',
            placeholder: 'https://'
          },
          {
            name: 'next_review',
            label: 'Next scheduled metric review',
            kind: 'date'
          },
          {
            name: 'metric_use',
            label: 'How is this metric set used?',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a classification' },
              { value: 'diagnostic', label: 'Diagnostic only: informs investigation' },
              { value: 'evaluative', label: 'Evaluative: informs judgement of performance' },
              { value: 'mixed', label: 'Mixed, documented per metric' }
            ]
          },
          {
            name: 'metric_class',
            label: 'Input, output, or outcome weighting',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a weighting' },
              { value: 'outcome_weighted', label: 'Mostly outcome metrics' },
              { value: 'balanced', label: 'Balanced across input, output, outcome' },
              { value: 'output_weighted', label: 'Mostly output metrics' },
              { value: 'activity_weighted', label: 'Mostly activity metrics' }
            ]
          },
          {
            name: 'statistic_convention',
            label: 'Statistical convention for time-based figures',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a convention' },
              { value: 'median_percentile', label: 'Median and percentiles' },
              { value: 'mean', label: 'Arithmetic mean' },
              { value: 'mixed', label: 'Mixed, noted per metric' }
            ]
          },
          {
            name: 'decision_informed',
            label: 'What decision does this metric set inform?',
            kind: 'textarea',
            placeholder:
              'Name the specific decision. A metric that informs no decision is a candidate for retirement.'
          },
          {
            name: 'non_goals',
            label: 'Explicit non-goals',
            kind: 'textarea',
            placeholder:
              'State what these numbers are not used for, e.g. individual performance evaluation or cross-team ranking without context.'
          },
          {
            name: 'gaming_vectors',
            label: 'Named gaming vectors',
            kind: 'textarea',
            placeholder:
              'For each incentivized metric: how would a rational team make this number look good without doing better work?'
          },
          {
            name: 'guardrails',
            label: 'Paired guardrails',
            kind: 'textarea',
            placeholder:
              'e.g. deployment frequency paired with change failure rate; delivery speed paired with escaped defect rate.'
          },
          {
            name: 'governance_checklist',
            label: 'New metric review checklist',
            kind: 'checkbox',
            choices: [
              { value: 'named_decision', label: 'Every metric has a named decision it informs' },
              { value: 'classified', label: 'Each metric is classified diagnostic or evaluative, in writing' },
              { value: 'guardrail_defined', label: 'Guardrails defined for every incentivized metric' },
              { value: 'gaming_named', label: 'Gaming vector named for each' },
              { value: 'owner_named', label: 'Each metric has a named owner and documented source' },
              { value: 'percentiles', label: 'Skewed time metrics use median or percentile, not average' },
              { value: 'not_individual', label: 'Not used for individual evaluation' },
              {
                value: 'retired',
                label: 'At least one metric retired in the last cycle if it stopped informing decisions'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Flow metrics',
    note:
      "Flow load = arrival rate x flow time (Little's law). Report velocity " +
      'and distribution together; velocity alone says nothing about what kind ' +
      'of work is getting done.',
    groups: [
      {
        legend: 'Flow velocity',
        fields: [
          {
            name: 'flow_velocity',
            label: 'Flow velocity: items completed',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'flow_velocity_unit',
            label: 'Per unit of time',
            kind: 'select',
            choices: PER_UNIT
          },
          {
            name: 'flow_item_definition',
            label: 'Flow item definition',
            kind: 'text',
            hint: 'What counts as one item, and when it is classified.'
          }
        ]
      },
      {
        legend: 'Flow distribution',
        note:
          'The share of completed items by type. The four percentages should ' +
          'total 100.',
        fields: [
          { name: 'dist_features', label: 'Features (%)', kind: 'number', min: 0, max: 100, step: 0.1 },
          { name: 'dist_defects', label: 'Defects (%)', kind: 'number', min: 0, max: 100, step: 0.1 },
          {
            name: 'dist_risks',
            label: 'Risks, including security and compliance (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          { name: 'dist_debt', label: 'Technical debt (%)', kind: 'number', min: 0, max: 100, step: 0.1 }
        ]
      },
      {
        legend: 'Flow time, flow load, and efficiency',
        fields: [
          {
            name: 'flow_time_median',
            label: 'Flow time, median (days)',
            kind: 'number',
            min: 0,
            step: 0.1,
            hint: 'Entry to the value stream through to delivery.'
          },
          {
            name: 'flow_time_p90',
            label: 'Flow time, 90th percentile (days)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'flow_load',
            label: 'Flow load: items active or waiting (count)',
            kind: 'number',
            min: 0,
            step: 1
          },
          { name: 'wip_limit', label: 'Work-in-process limit, if set', kind: 'number', min: 0, step: 1 },
          {
            name: 'arrival_rate',
            label: 'Arrival rate (items per week)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'flow_efficiency',
            label: 'Flow efficiency (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            hint: 'Active work time / total elapsed time.'
          },
          {
            name: 'utilization',
            label: 'Utilization (%)',
            kind: 'number',
            min: 0,
            max: 200,
            step: 0.1,
            hint: 'Arrival rate / service rate, for shared resources.'
          },
          {
            name: 'blocked_items',
            label: 'Items currently blocked (count)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'aging_items',
            label: 'Items older than the flow time 90th percentile',
            kind: 'number',
            min: 0,
            step: 1
          }
        ]
      },
      {
        legend: 'Cycle time decomposition (hours per stage)',
        fields: [
          { name: 'stage_coding', label: 'Coding time', kind: 'number', min: 0, step: 0.1 },
          { name: 'stage_pickup', label: 'Pickup time', kind: 'number', min: 0, step: 0.1 },
          { name: 'stage_review', label: 'Review time', kind: 'number', min: 0, step: 0.1 },
          { name: 'stage_test', label: 'Test time', kind: 'number', min: 0, step: 0.1 },
          { name: 'stage_deploy', label: 'Deploy time', kind: 'number', min: 0, step: 0.1 },
          {
            name: 'cycle_time_total',
            label: 'Total cycle time, median (hours)',
            kind: 'number',
            min: 0,
            step: 0.1
          }
        ]
      },
      {
        legend: 'Lean value stream metrics',
        fields: [
          {
            name: 'pca',
            label: 'Percent complete and accurate, %C/A (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            hint: 'Units usable downstream without rework.'
          },
          {
            name: 'rty',
            label: 'Rolled throughput yield (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            hint: 'Product of %C/A across all stages.'
          },
          {
            name: 'takt_time',
            label: 'Takt time (hours per item)',
            kind: 'number',
            min: 0,
            step: 0.1,
            hint: 'Available working time / customer demand.'
          },
          { name: 'handoffs', label: 'Handoffs per item (count)', kind: 'number', min: 0, step: 1 },
          {
            name: 'bottleneck',
            label: 'Identified bottleneck stage',
            kind: 'text',
            placeholder: 'Which stage holds the largest queue, and what evidence points to it.'
          }
        ]
      }
    ]
  },
  {
    title: 'Code review metrics',
    note:
      'Review speed metrics need a quality guardrail. Faster reviews that ' +
      'catch less are not an improvement.',
    groups: [
      {
        fields: [
          {
            name: 'prs_opened',
            label: 'Pull requests opened (count in period)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'prs_merged',
            label: 'Pull requests merged (count in period)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'ttfr_median',
            label: 'Time to first review, median (hours)',
            kind: 'number',
            min: 0,
            step: 0.1,
            hint: 'Opened to first substantive reviewer response.'
          },
          {
            name: 'ttfr_p90',
            label: 'Time to first review, 90th percentile (hours)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'review_duration_median',
            label: 'Review duration, median (hours)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'pr_size_median',
            label: 'Pull request size, median (lines changed)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'reviewers_per_pr',
            label: 'Reviewers per pull request (mean)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'review_iterations',
            label: 'Review iterations per pull request (median)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'rubber_stamp_rate',
            label: 'Approvals with no comments (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            hint: 'A gaming signal for review-speed targets.'
          },
          {
            name: 'stale_prs',
            label: 'Pull requests open longer than seven days',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'review_participation',
            label: 'Review participation (% of engineers reviewing)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'defects_caught_in_review',
            label: 'Defects caught in review (count)',
            kind: 'number',
            min: 0,
            step: 1,
            hint: 'The quality guardrail for review speed.'
          }
        ]
      }
    ]
  },
  {
    title: 'DORA delivery metrics',
    note:
      'The four DORA metrics are a system-level set. Report throughput ' +
      '(deployment frequency, lead time) alongside stability (change failure ' +
      'rate, recovery time), never one pair alone.',
    groups: [
      {
        fields: [
          {
            name: 'deploy_count',
            label: 'Successful production deployments (count in period)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'deploy_frequency',
            label: 'Deployment frequency (deployments per unit)',
            kind: 'number',
            min: 0,
            step: 0.01
          },
          {
            name: 'deploy_frequency_unit',
            label: 'Deployment frequency unit',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a unit' },
              { value: 'day', label: 'Per day' },
              { value: 'week', label: 'Per week' },
              { value: 'month', label: 'Per month' }
            ]
          },
          {
            name: 'lead_time_median',
            label: 'Lead time for changes, median (hours)',
            kind: 'number',
            min: 0,
            step: 0.1,
            hint: 'First commit to successful production deployment.'
          },
          {
            name: 'lead_time_p90',
            label: 'Lead time for changes, 90th percentile (hours)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'failed_deploys',
            label: 'Deployments causing a failure (count)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'change_failure_rate',
            label: 'Change failure rate (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'recovery_time_median',
            label: 'Failed deployment recovery time, median (hours)',
            kind: 'number',
            min: 0,
            step: 0.1,
            hint: 'Failure detection to genuine service restoration.'
          },
          {
            name: 'recovery_time_p90',
            label: 'Failed deployment recovery time, 90th percentile (hours)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'dora_band',
            label: 'Self-assessed performance band',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a band' },
              { value: 'elite', label: 'Elite' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
              { value: 'unknown', label: 'Not assessed' }
            ]
          },
          {
            name: 'rollback_count',
            label: 'Rollbacks or hotfixes (count)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'deploy_scope',
            label: 'What counts as a deployment here?',
            kind: 'text',
            placeholder:
              'e.g. any merge to main reaching production, excluding config-only changes'
          }
        ]
      }
    ]
  },
  {
    title: 'Developer experience',
    note:
      'Use at least one metric from at least three SPACE dimensions, mixing ' +
      'subjective and objective signals. Activity metrics are the dimension ' +
      'most prone to misuse: never report them standalone, and never per ' +
      'individual.',
    groups: [
      {
        legend: 'Satisfaction and well-being',
        fields: [
          {
            name: 'satisfaction_score',
            label: 'Developer satisfaction, mean (1\u20135)',
            kind: 'number',
            min: 1,
            max: 5,
            step: 0.1
          },
          {
            name: 'enps',
            label: 'Employee net promoter score (\u2212100 to 100)',
            kind: 'number',
            min: -100,
            max: 100,
            step: 1
          },
          {
            name: 'burnout_risk',
            label: 'Respondents reporting burnout risk (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'voluntary_attrition',
            label: 'Voluntary attrition over the period (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'tooling_satisfaction',
            label: 'Satisfaction with tooling (1\u20135)',
            kind: 'number',
            min: 1,
            max: 5,
            step: 0.1
          },
          {
            name: 'docs_satisfaction',
            label: 'Satisfaction with documentation (1\u20135)',
            kind: 'number',
            min: 1,
            max: 5,
            step: 0.1
          }
        ]
      },
      {
        legend: 'Efficiency and flow: focus time and interruptions',
        fields: [
          {
            name: 'focus_blocks',
            label: 'Uninterrupted blocks of two hours or more (per engineer per week)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'focus_hours',
            label: 'Total focus hours (per engineer per week)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'meeting_hours',
            label: 'Meeting hours (per engineer per week)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'interruptions',
            label: 'Unplanned interruptions (per engineer per day)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'context_switches',
            label: 'Concurrent work items per engineer (mean)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'unplanned_work',
            label: 'Unplanned work as a share of capacity (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          }
        ]
      },
      {
        legend: 'Objective DevEx instrumentation',
        note:
          'Pair every subjective response with the objective signal it refers ' +
          'to. Divergence between perception and measurement is itself worth ' +
          'investigating.',
        fields: [
          {
            name: 'build_time',
            label: 'Local build time, median (minutes)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'test_suite_time',
            label: 'Full test suite run time (minutes)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'ci_wait',
            label: 'CI queue wait, median (minutes)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'onboarding_setup',
            label: 'Local environment setup time (hours)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'time_to_first_commit',
            label: 'New joiner time to first merged change (days)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'feedback_loop_time',
            label: 'Slowest routine feedback loop (minutes)',
            kind: 'number',
            min: 0,
            step: 0.1
          }
        ]
      },
      {
        legend: 'DevEx dimensions',
        note: 'Self-assessed on a five-point scale.',
        fields: [
          {
            name: 'devex_feedback',
            label: 'Feedback loops (1\u20135)',
            kind: 'select',
            choices: [
              { value: '', label: 'Not assessed' },
              { value: '1', label: '1 \u2013 very poor' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5 \u2013 very good' }
            ]
          },
          {
            name: 'devex_cognitive_load',
            label: 'Cognitive load (1\u20135, higher is better)',
            kind: 'select',
            choices: [
              { value: '', label: 'Not assessed' },
              { value: '1', label: '1 \u2013 overwhelming' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5 \u2013 manageable' }
            ]
          },
          {
            name: 'devex_flow_state',
            label: 'Flow state (1\u20135)',
            kind: 'select',
            choices: [
              { value: '', label: 'Not assessed' },
              { value: '1', label: '1 \u2013 rarely achieved' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5 \u2013 routinely achieved' }
            ]
          }
        ]
      },
      {
        legend: 'Communication and collaboration',
        fields: [
          {
            name: 'bus_factor',
            label: 'Bus factor',
            kind: 'number',
            min: 0,
            step: 1,
            hint: 'People who would have to leave before a critical area is orphaned.'
          },
          {
            name: 'knowledge_concentration',
            label: 'Files with a single dominant author (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'cross_team_deps',
            label: 'Cross-team dependencies blocking work (count)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'onboarding_time',
            label: 'Time to full productivity for a new joiner (weeks)',
            kind: 'number',
            min: 0,
            step: 0.5
          }
        ]
      },
      {
        legend: 'Survey mechanics',
        fields: [
          { name: 'survey_date', label: 'Most recent survey closed on', kind: 'date' },
          { name: 'survey_invitations', label: 'Invitations sent', kind: 'number', min: 0, step: 1 },
          { name: 'survey_responses', label: 'Responses received', kind: 'number', min: 0, step: 1 },
          {
            name: 'response_rate',
            label: 'Response rate (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            hint: 'A declining rate is itself a trust signal.'
          },
          {
            name: 'response_rate_trend',
            label: 'Response rate trend since last cycle',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a trend' },
              { value: 'rising', label: 'Rising' },
              { value: 'flat', label: 'Flat' },
              { value: 'falling', label: 'Falling' },
              { value: 'first_cycle', label: 'First cycle' }
            ]
          },
          {
            name: 'survey_scale',
            label: 'Response scale used',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a scale' },
              { value: 'likert5', label: 'Five-point Likert' },
              { value: 'likert7', label: 'Seven-point Likert' },
              { value: 'binary', label: 'Binary' },
              { value: 'mixed', label: 'Mixed scales' }
            ]
          },
          {
            name: 'survey_practices',
            label: 'Survey design practices confirmed',
            kind: 'checkbox',
            choices: [
              { value: 'anonymity', label: 'Anonymity genuinely protected' },
              { value: 'piloted', label: 'New questions piloted before wide rollout' },
              { value: 'single_barrelled', label: 'No double-barrelled or leading questions' },
              { value: 'consistent_scale', label: 'Consistent scale across the instrument' },
              { value: 'results_published', label: 'Results published honestly, including unflattering ones' },
              { value: 'loop_closed', label: 'At least one concrete action taken and communicated' }
            ]
          },
          {
            name: 'survey_action',
            label: 'Action taken in response to the last survey',
            kind: 'textarea',
            placeholder: 'Name one concrete change made and communicated back to respondents.'
          }
        ]
      },
      {
        legend: 'Activity metrics, for aggregate context only',
        note:
          'Report these only in aggregate and only alongside outcome metrics. ' +
          'Never attribute them to an individual.',
        fields: [
          {
            name: 'commits_per_week',
            label: 'Commits per week (team total)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'active_contributors',
            label: 'Active contributors in period',
            kind: 'number',
            min: 0,
            step: 1
          }
        ]
      }
    ]
  },
  {
    title: 'Code quality metrics',
    groups: [
      {
        fields: [
          {
            name: 'cyclomatic_mean',
            label: 'Cyclomatic complexity, mean per function',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'cyclomatic_max',
            label: 'Cyclomatic complexity, maximum',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'complexity_threshold_breaches',
            label: 'Functions above the agreed complexity threshold',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'coverage_line',
            label: 'Test coverage, lines (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'coverage_branch',
            label: 'Test coverage, branches (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'mutation_kill_rate',
            label: 'Mutation kill rate (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            hint: 'The effectiveness guardrail for coverage.'
          },
          {
            name: 'flaky_rate',
            label: 'Flaky test rate (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'churn',
            label: 'Code churn (lines added, modified, deleted per week)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'hotspot_file',
            label: 'Top hotspot file',
            kind: 'text',
            placeholder: 'path/to/file',
            hint: 'Highest churn x complexity.'
          },
          { name: 'hotspot_score', label: 'Top hotspot score', kind: 'number', min: 0, step: 0.1 },
          {
            name: 'static_critical',
            label: 'Static analysis issues, critical',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'static_major',
            label: 'Static analysis issues, major',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'static_minor',
            label: 'Static analysis issues, minor',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'new_issues_per_kloc',
            label: 'New issues introduced per thousand lines changed',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'debt_ratio',
            label: 'Technical debt ratio (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            hint: 'Estimated remediation cost / estimated development cost.'
          },
          {
            name: 'debt_carrying_cost',
            label: 'Debt carrying cost (per month)',
            kind: 'number',
            min: 0,
            step: 1,
            hint: 'Ongoing cost of not fixing: slower related work, elevated defect risk.'
          },
          {
            name: 'debt_capacity',
            label: 'Capacity allocated to debt reduction (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'debt_items_open',
            label: 'Tracked debt items open (count)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'docs_coverage',
            label: 'Documentation coverage of key areas (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'docs_staleness',
            label: 'Median age of documentation last update (days)',
            kind: 'number',
            min: 0,
            step: 1
          }
        ]
      }
    ]
  },
  {
    title: 'Product and business outcomes',
    note:
      'Outcome metrics are the point. Shipping is not the outcome; what the ' +
      'shipping changed for a user or for the business is.',
    groups: [
      {
        legend: 'Escaped defects and quality escapes',
        fields: [
          { name: 'escaped_critical', label: 'Escaped defects, critical', kind: 'number', min: 0, step: 1 },
          { name: 'escaped_high', label: 'Escaped defects, high', kind: 'number', min: 0, step: 1 },
          { name: 'escaped_medium', label: 'Escaped defects, medium', kind: 'number', min: 0, step: 1 },
          { name: 'escaped_low', label: 'Escaped defects, low', kind: 'number', min: 0, step: 1 },
          {
            name: 'escaped_rate',
            label: 'Severity-weighted escaped defect rate',
            kind: 'number',
            min: 0,
            step: 0.01
          },
          {
            name: 'escaped_rate_basis',
            label: 'Rate basis',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a basis' },
              { value: 'per_release', label: 'Per release' },
              { value: 'per_month', label: 'Per month' },
              { value: 'per_kloc', label: 'Per thousand lines changed' },
              { value: 'per_feature', label: 'Per feature delivered' }
            ]
          },
          {
            name: 'defect_detection_stage',
            label: 'Where most defects are caught',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a stage' },
              { value: 'development', label: 'Development' },
              { value: 'code_review', label: 'Code review' },
              { value: 'automated_test', label: 'Automated test' },
              { value: 'manual_qa', label: 'Manual QA' },
              { value: 'staging', label: 'Staging' },
              { value: 'production', label: 'Production, reported by users' }
            ]
          }
        ]
      },
      {
        legend: 'Feature adoption',
        fields: [
          { name: 'feature_name', label: 'Feature assessed', kind: 'text' },
          {
            name: 'target_audience',
            label: 'Target audience size (users)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'initial_adoption',
            label: 'Initial adoption (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            hint: 'Users who tried it at least once / target audience.'
          },
          {
            name: 'retained_adoption',
            label: 'Retained adoption (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            hint: 'Still using it after N weeks / users who initially tried it.'
          },
          {
            name: 'retention_window',
            label: 'Retention window, N (weeks)',
            kind: 'number',
            min: 1,
            step: 1
          },
          {
            name: 'features_unused',
            label: 'Delivered features with negligible adoption (count)',
            kind: 'number',
            min: 0,
            step: 1
          }
        ]
      },
      {
        legend: 'Customer and business outcomes',
        fields: [
          {
            name: 'csat',
            label: 'Customer satisfaction, CSAT (1\u20135)',
            kind: 'number',
            min: 1,
            max: 5,
            step: 0.1
          },
          {
            name: 'nps',
            label: 'Net promoter score (\u2212100 to 100)',
            kind: 'number',
            min: -100,
            max: 100,
            step: 1
          },
          {
            name: 'task_success',
            label: 'Task success rate (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'support_tickets',
            label: 'Support tickets attributable to this subject',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'customer_churn',
            label: 'Customer churn over the period (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'revenue_impact',
            label: 'Revenue attributable or at risk',
            kind: 'number',
            step: 0.01
          }
        ]
      },
      {
        legend: 'Cost, unit economics, and return on investment',
        fields: [
          {
            name: 'currency',
            label: 'Currency',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a currency' },
              { value: 'USD', label: 'USD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
              { value: 'CAD', label: 'CAD' },
              { value: 'AUD', label: 'AUD' },
              { value: 'JPY', label: 'JPY' },
              { value: 'other', label: 'Other' }
            ]
          },
          {
            name: 'unit_cost',
            label: 'Unit cost',
            kind: 'number',
            min: 0,
            step: 0.01,
            hint: 'Total cost (people, infrastructure, tooling) / meaningful unit.'
          },
          {
            name: 'unit_basis',
            label: 'Unit basis',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a basis' },
              { value: 'per_customer', label: 'Per customer' },
              { value: 'per_transaction', label: 'Per transaction' },
              { value: 'per_request', label: 'Per thousand requests' },
              { value: 'per_active_user', label: 'Per monthly active user' },
              { value: 'per_feature', label: 'Per feature delivered' }
            ]
          },
          {
            name: 'cost_people',
            label: 'Cost: people (per period)',
            kind: 'number',
            min: 0,
            step: 0.01
          },
          {
            name: 'cost_infrastructure',
            label: 'Cost: infrastructure (per period)',
            kind: 'number',
            min: 0,
            step: 0.01
          },
          {
            name: 'cost_tooling',
            label: 'Cost: tooling and licences (per period)',
            kind: 'number',
            min: 0,
            step: 0.01
          },
          { name: 'tco', label: 'Total cost of ownership', kind: 'number', min: 0, step: 0.01 },
          {
            name: 'total_benefit',
            label: 'Total documented benefit',
            kind: 'number',
            step: 0.01
          },
          {
            name: 'roi_conservative',
            label: 'ROI, conservative case (%)',
            kind: 'number',
            step: 0.1
          },
          {
            name: 'roi_optimistic',
            label: 'ROI, optimistic case (%)',
            kind: 'number',
            step: 0.1
          },
          {
            name: 'roi_assumption',
            label: 'Key assumption driving the ROI range',
            kind: 'textarea',
            placeholder: 'Name the single assumption that most moves the number.'
          },
          {
            name: 'roi_confounds',
            label: 'Confounds considered and ruled out',
            kind: 'textarea',
            placeholder:
              'What else could explain the benefit, and why it was ruled out or accounted for.'
          }
        ]
      }
    ]
  },
  {
    title: 'Reliability, operations, and security',
    groups: [
      {
        legend: 'Service level objectives and error budget',
        fields: [
          {
            name: 'sli_name',
            label: 'Primary service level indicator',
            kind: 'text',
            placeholder: 'e.g. successful requests over total requests'
          },
          { name: 'slo_target', label: 'SLO target (%)', kind: 'number', min: 0, max: 100, step: 0.001 },
          { name: 'slo_window', label: 'SLO window (days)', kind: 'number', min: 1, step: 1 },
          {
            name: 'slo_actual',
            label: 'SLI actual for the window (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.001
          },
          {
            name: 'error_budget_minutes',
            label: 'Error budget allotted (minutes)',
            kind: 'number',
            min: 0,
            step: 0.1,
            hint: '(1 \u2212 SLO target) x window.'
          },
          {
            name: 'error_budget_consumed',
            label: 'Error budget consumed (%)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'burn_rate',
            label: 'Error budget burn rate',
            kind: 'number',
            min: 0,
            step: 0.01,
            hint: 'Budget consumed / budget allotted over the window.'
          },
          {
            name: 'availability',
            label: 'Availability (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.001
          },
          { name: 'latency_p50', label: 'Latency, p50 (ms)', kind: 'number', min: 0, step: 1 },
          { name: 'latency_p95', label: 'Latency, p95 (ms)', kind: 'number', min: 0, step: 1 },
          { name: 'latency_p99', label: 'Latency, p99 (ms)', kind: 'number', min: 0, step: 1 },
          {
            name: 'error_rate',
            label: 'Error rate (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.001
          }
        ]
      },
      {
        legend: 'Incidents: detection, response, recovery',
        fields: [
          { name: 'incidents_sev1', label: 'Incidents, severity 1', kind: 'number', min: 0, step: 1 },
          { name: 'incidents_sev2', label: 'Incidents, severity 2', kind: 'number', min: 0, step: 1 },
          { name: 'incidents_sev3', label: 'Incidents, severity 3', kind: 'number', min: 0, step: 1 },
          {
            name: 'incidents_sev4',
            label: 'Incidents, severity 4 and below',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'mttd_median',
            label: 'MTTD, median (minutes)',
            kind: 'number',
            min: 0,
            step: 0.1,
            hint: 'Incident onset to detection.'
          },
          {
            name: 'mtta_median',
            label: 'MTTA, median (minutes)',
            kind: 'number',
            min: 0,
            step: 0.1,
            hint: 'Notification to acknowledgement.'
          },
          {
            name: 'mttr_median',
            label: 'MTTR, median (minutes)',
            kind: 'number',
            min: 0,
            step: 0.1,
            hint: 'Acknowledgement to genuine service restoration.'
          },
          {
            name: 'mttr_p90',
            label: 'MTTR, 90th percentile (minutes)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'customer_reported',
            label: 'Incidents first reported by customers (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            hint: 'The honesty check on detection coverage.'
          },
          {
            name: 'postmortems_completed',
            label: 'Postmortems completed for qualifying incidents (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'action_items_closed',
            label: 'Postmortem action items closed on time (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'repeat_incidents',
            label: 'Repeat incidents with the same root cause',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'postmortem_practices',
            label: 'Postmortem practice',
            kind: 'checkbox',
            choices: [
              { value: 'blameless', label: 'Investigates the system, not the individual' },
              { value: 'documented_severity', label: 'Severity classified against documented criteria' },
              { value: 'times_recorded', label: 'Detection, acknowledgement, and resolution times recorded' },
              { value: 'actions_tracked', label: 'Action items specific, assigned, and tracked to completion' },
              { value: 'shared_openly', label: 'Shared without fear of individual consequence' }
            ]
          }
        ]
      },
      {
        legend: 'On-call, capacity, and operational load',
        fields: [
          { name: 'pages_total', label: 'Pages in the period (total)', kind: 'number', min: 0, step: 1 },
          {
            name: 'pages_max_individual',
            label: 'Pages received by the most-paged individual',
            kind: 'number',
            min: 0,
            step: 1,
            hint: 'Report the distribution, not the team average.'
          },
          {
            name: 'pages_out_of_hours',
            label: 'Pages outside working hours (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'pages_actionable',
            label: 'Pages that were actionable (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1,
            hint: 'The guardrail against alert fatigue.'
          },
          {
            name: 'toil_percentage',
            label: 'Time spent on toil (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'oncall_rotation_size',
            label: 'On-call rotation size (people)',
            kind: 'number',
            min: 0,
            step: 1
          }
        ]
      },
      {
        legend: 'Security and vulnerability management',
        note:
          'Time-to-remediate by severity matters more than a raw ' +
          'open-vulnerability count. Track remediation against explicit ' +
          'targets per severity.',
        fields: [
          {
            name: 'vuln_open_critical',
            label: 'Open vulnerabilities, critical',
            kind: 'number',
            min: 0,
            step: 1
          },
          { name: 'vuln_open_high', label: 'Open vulnerabilities, high', kind: 'number', min: 0, step: 1 },
          {
            name: 'vuln_open_medium',
            label: 'Open vulnerabilities, medium',
            kind: 'number',
            min: 0,
            step: 1
          },
          { name: 'vuln_open_low', label: 'Open vulnerabilities, low', kind: 'number', min: 0, step: 1 },
          {
            name: 'ttr_critical',
            label: 'Time to remediate, critical: median (days)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'ttr_high',
            label: 'Time to remediate, high: median (days)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'ttr_target_critical',
            label: 'Remediation target, critical (days)',
            kind: 'number',
            min: 0,
            step: 0.1
          },
          {
            name: 'ttr_within_target',
            label: 'Vulnerabilities remediated within target (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'vuln_oldest',
            label: 'Age of the oldest open critical vulnerability (days)',
            kind: 'number',
            min: 0,
            step: 1
          },
          {
            name: 'scan_coverage',
            label: 'Scanner coverage of repositories and services (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'security_debt_capacity',
            label: 'Protected capacity for security debt (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'accepted_risks',
            label: 'Formally accepted risks (count)',
            kind: 'number',
            min: 0,
            step: 1,
            hint: 'Items consciously not remediated, made visible and quantified.'
          },
          {
            name: 'security_practices',
            label: 'Security practice',
            kind: 'checkbox',
            choices: [
              {
                value: 'exposure_weighted',
                label: 'Prioritization accounts for actual exposure, not severity score alone'
              },
              {
                value: 'same_backlog',
                label: 'Security work competes on the same explicit backlog as other work'
              },
              {
                value: 'targets_by_severity',
                label: 'Explicit remediation-time targets set per severity'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'AI-assisted development',
    note:
      'Measure AI assistance by outcome, not by output volume or ' +
      'vendor-reported usage. Account for the full cycle, including review ' +
      'and correction time, and segment by task type: a single blended ' +
      'number hides where value actually concentrates.',
    groups: [
      {
        fields: [
          {
            name: 'ai_usage',
            label: 'AI assistance in use',
            kind: 'checkbox',
            choices: [
              { value: 'code_completion', label: 'Inline code completion' },
              { value: 'chat_assistant', label: 'Chat assistant' },
              { value: 'agentic', label: 'Agentic coding tools' },
              { value: 'code_review', label: 'AI-assisted code review' },
              { value: 'test_generation', label: 'Test generation' },
              { value: 'documentation', label: 'Documentation generation' },
              { value: 'incident_triage', label: 'Incident triage or summarization' },
              { value: 'none', label: 'None in this period' }
            ]
          },
          {
            name: 'ai_access',
            label: 'Engineers with access to AI tooling (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'ai_assisted_changes',
            label: 'Merged changes with AI assistance (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'ai_measurement_design',
            label: 'Measurement design used',
            kind: 'select',
            choices: [
              { value: '', label: 'Select a design' },
              { value: 'none', label: 'No measurement, anecdote only' },
              { value: 'self_report', label: 'Self-reported time savings only' },
              { value: 'before_after', label: 'Before-and-after comparison' },
              { value: 'comparison_group', label: 'Genuine comparison group' },
              { value: 'task_segmented', label: 'Task-segmented outcome measurement' }
            ]
          },
          {
            name: 'ai_self_reported_savings',
            label: 'Self-reported time saved (hours per engineer per week)',
            kind: 'number',
            min: 0,
            step: 0.1,
            hint: 'A weak signal alone. Pair with measured cycle time.'
          },
          {
            name: 'ai_cycle_time_change',
            label: 'Change in end-to-end cycle time (%)',
            kind: 'number',
            step: 0.1,
            hint: 'Negative means faster. Must include review and correction time.'
          },
          {
            name: 'ai_review_time_change',
            label: 'Change in review time per change (%)',
            kind: 'number',
            step: 0.1
          },
          {
            name: 'ai_rework_rate',
            label: 'AI-assisted changes requiring significant rework (%)',
            kind: 'number',
            min: 0,
            max: 100,
            step: 0.1
          },
          {
            name: 'ai_cfr_change',
            label: 'Change in change failure rate (percentage points)',
            kind: 'number',
            step: 0.1
          },
          {
            name: 'ai_escaped_defect_change',
            label: 'Change in escaped defect rate (%)',
            kind: 'number',
            step: 0.1
          },
          {
            name: 'ai_review_capacity',
            label: 'Review capacity strain',
            kind: 'select',
            choices: [
              { value: '', label: 'Select an assessment' },
              { value: 'unchanged', label: 'Unchanged' },
              { value: 'rising', label: 'Rising: review is becoming the bottleneck' },
              { value: 'strained', label: 'Strained: review depth is visibly dropping' },
              { value: 'not_tracked', label: 'Not tracked' }
            ]
          },
          {
            name: 'ai_tool_cost',
            label: 'AI tooling cost (per period)',
            kind: 'number',
            min: 0,
            step: 0.01
          },
          {
            name: 'ai_task_segments',
            label: 'Task segments measured, and where value concentrates',
            kind: 'textarea',
            placeholder:
              'e.g. boilerplate and test scaffolding show large gains; novel domain logic shows none.'
          },
          {
            name: 'ai_comparison_group',
            label: 'Comparison group or baseline description',
            kind: 'textarea',
            placeholder:
              'How the comparison was constructed, and what industry-wide trends could confound it.'
          },
          {
            name: 'ai_audit',
            label: 'AI-era metric audit checklist',
            kind: 'checkbox',
            choices: [
              {
                value: 'inflation_tested',
                label:
                  'Each dashboard metric tested against: would heavy AI use inflate this without better outcomes?'
              },
              {
                value: 'cfr_reviewed',
                label: 'Change failure rate and defect rate reviewed alongside any rise in output volume'
              },
              {
                value: 'review_monitored',
                label: 'Review capacity and depth monitored as AI-generated volume grows'
              },
              {
                value: 'defects_tagged',
                label: 'Escaped defects tagged by AI-assistance level, to test rather than assume the link'
              },
              {
                value: 'detection_hardened',
                label: 'Detection methods resistant to plausible-looking defects, such as mutation testing'
              },
              { value: 'charter_updated', label: 'Metrics charter explicitly revisited for the AI era' }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Maturity self-assessment',
    note:
      'Score against concrete evidence, not intention. Programme maturity is ' +
      'the minimum across dimensions, not the average.',
    groups: [
      {
        legend: 'Capability scores',
        note: 'Score each capability from 1 to 5, or leave blank if not assessed.',
        fields: [
          {
            name: 'maturity_p1',
            label: 'Part 1 \u2013 Foundations: governance, instrumentation, statistical literacy',
            kind: 'select',
            choices: MATURITY_LEVELS
          },
          {
            name: 'maturity_p2',
            label: 'Part 2 \u2013 Flow metrics: value stream, flow time, DORA adoption',
            kind: 'select',
            choices: MATURITY_LEVELS
          },
          {
            name: 'maturity_p3',
            label: 'Part 3 \u2013 Developer experience: SPACE balance, survey rigor, focus time',
            kind: 'select',
            choices: MATURITY_LEVELS
          },
          {
            name: 'maturity_p4',
            label: 'Part 4 \u2013 Code and quality: complexity, test effectiveness, debt measurement',
            kind: 'select',
            choices: MATURITY_LEVELS
          },
          {
            name: 'maturity_p5',
            label: 'Part 5 \u2013 Product and business: escaped defects, adoption, unit economics',
            kind: 'select',
            choices: MATURITY_LEVELS
          },
          {
            name: 'maturity_p6',
            label: 'Part 6 \u2013 Reliability and security: SLOs, incident metrics, remediation discipline',
            kind: 'select',
            choices: MATURITY_LEVELS
          },
          {
            name: 'maturity_p7',
            label: 'Part 7 \u2013 AI era: evidence-based assessment of AI-assisted development',
            kind: 'select',
            choices: MATURITY_LEVELS
          },
          {
            name: 'maturity_p8',
            label: 'Part 8 \u2013 Programme: dashboards, rollout, adoption roadmap',
            kind: 'select',
            choices: MATURITY_LEVELS
          }
        ]
      },
      {
        fields: [
          {
            name: 'maturity_overall',
            label: 'Overall programme maturity',
            kind: 'select',
            choices: MATURITY_LEVELS,
            hint: 'The minimum across dimensions, not the average.'
          },
          {
            name: 'maturity_evidence',
            label: 'Evidence supporting these scores',
            kind: 'textarea',
            placeholder: 'What concrete artefacts or observations justify each score.'
          },
          {
            name: 'improvement_priority',
            label: 'Lowest-scoring capability to invest in next',
            kind: 'textarea',
            placeholder:
              'Feed low scores into the adoption roadmap as investment priorities, not as a verdict.'
          }
        ]
      }
    ]
  },
  {
    title: 'Caveats, exclusions, and sign-off',
    groups: [
      {
        fields: [
          {
            name: 'notable_changes',
            label: 'Movement outside normal variation',
            kind: 'textarea',
            placeholder:
              'Which readings moved beyond normal variation this period, and what is known about why.'
          },
          {
            name: 'deliberate_exclusions',
            label: 'What this submission deliberately excludes',
            kind: 'textarea',
            placeholder:
              'Name anything intentionally left off and why, for example individual activity counts.'
          },
          {
            name: 'caveats',
            label: 'Caveats and known data quality issues',
            kind: 'textarea',
            placeholder:
              'Definition changes, pipeline gaps, partial periods, or anything that makes a figure less comparable than it looks.'
          },
          {
            name: 'definition_changes',
            label: 'Definition changes since the last submission',
            kind: 'textarea',
            placeholder:
              'Any changed formula, source system, or scope, which breaks comparability with earlier periods.'
          },
          {
            name: 'metrics_retired',
            label: 'Metrics proposed for retirement',
            kind: 'textarea',
            placeholder: 'Which metrics have not informed a decision in the last two cycles.'
          },
          { name: 'additional_notes', label: 'Anything else', kind: 'textarea' },
          {
            name: 'attestation',
            label: 'Attestation',
            kind: 'checkbox',
            choices: [
              {
                value: 'verified',
                label:
                  'These figures were taken from the named source systems, not estimated, except where stated'
              },
              {
                value: 'not_individual',
                label: 'No figure here is attributed to an identifiable individual'
              },
              {
                value: 'guardrails_present',
                label: 'Every speed or output figure is reported alongside its guardrail'
              }
            ]
          },
          { name: 'submission_date', label: 'Submission date', kind: 'date' },
          {
            name: 'submission_status',
            label: 'Submission status',
            kind: 'select',
            initial: 'draft',
            choices: [
              { value: 'draft', label: 'Draft' },
              { value: 'for_review', label: 'Ready for review' },
              { value: 'final', label: 'Final' }
            ]
          }
        ]
      }
    ]
  }
];

/** Every question, flattened, in the order the sections ask them. */
export const fields: FieldSpec[] = sections.flatMap((section) =>
  section.groups.flatMap((group) => group.fields)
);

// Checkbox questions hold several answers at once, and number questions hold
// a number rather than text. Keeping each shape in its own record means no
// union type has to travel through the bindings in the page.
export interface FormState {
  values: Record<string, string>;
  numbers: Record<string, number | undefined>;
  checked: Record<string, string[]>;
}

/** A blank answer for every question, so every column always exists. */
export function emptyState(): FormState {
  const values: Record<string, string> = {};
  const numbers: Record<string, number | undefined> = {};
  const checked: Record<string, string[]> = {};
  for (const field of fields) {
    if (field.kind === 'checkbox') checked[field.name] = [];
    else if (field.kind === 'number') numbers[field.name] = undefined;
    else values[field.name] = field.initial ?? '';
  }
  return { values, numbers, checked };
}
