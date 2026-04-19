**REQ-B1-005:** A control labeled "Return to system recommendation" must be persistently visible at Step B1 when a Workflow A recommendation exists in session memory. Activating it must return the user to Step A5 with the Workflow A recommendation restored in full, unaffected by any Workflow B activity.
Priority: Must
Source: Amendment 2, Step B1

**REQ-B1-005a:** When the user has entered Workflow B without a prior Workflow A recommendation in the current session, the "Return to system recommendation" control must not be displayed. The control appears only when a Workflow A recommendation exists in session memory to return to. Displaying an inactive or disabled version of the control in this state is not acceptable — its absence is the correct signal that no system recommendation is available.
Priority: Must
Source: 07b-logical-data-model.md, Case 13
