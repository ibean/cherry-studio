# Project Context

## Purpose
[Describe your project's purpose and goals]

## Tech Stack
- [List your primary technologies]
- [e.g., TypeScript, React, Node.js]

## Project Conventions

### Code Style
- Follow the fail-fast principle: Masking errors is more dangerous than the errors themselves. Avoid using try-except statements or functions like hasattr to conceal errors. Only the top-level caller may use try-except to perform final handling of exceptions that cannot be resolved locally.
- Follow the clean code principles:
  * Use explicit parameters instead of implicit state, avoid hidden states, and steer clear of relying on hidden conventions.
  * Use guard clauses (such as `return`, `continue`, `break`, etc.) to handle edge cases and invalid parameters early, reducing nesting levels in the main logic.
- Decoupling
  * The callee remains passive and does not actively include the caller's logic and data. Bad case: A passes an image storage path to B. B processes the image, saves the result to a specific location based on an internal app_id mapping, and then returns the path to A. This is a coupling issue because B holds knowledge belonging to A (the app_id mapping table).
  * Principle of Least Knowledge: An object A should know as little as possible about the internal structure of object B. Bad case: A.getB().getC().getD().doSomething(). Here, A not only depends on B but is also forced to depend on the structures of C and D. If C changes, A breaks.
  * Avoid "Control Coupling": Do not dictate how others perform their tasks. Bad case: Control coupling occurs when the caller (A) controls the internal execution logic of the callee (B) by passing flags or parameters. This implies that A is aware of B's internal if/else logic.
- Single Responsibility
  * Each module has a single responsibility
  * Each code file has a single responsibility
  * Each class has a single responsibility
  * Each method has a single responsibility
  * Each variable has a single responsibility
- Entry Convergence Principle
Critical prerequisite logic must be converged within the component itself or its mandatory execution path; strictly avoid dispersing it across upstream call branches.
  * Bad Case: Multiple upstream callers individually invoke preprocess(img) before passing the result to LLM_infer.
  * Good Case: Preprocess(img) is invoked internally by LLM_infer or within a mandatory execution path.

### Architecture Patterns
Vertical Unidirectional Principle: Vertical means each module exposes only one outward-facing layer; unidirectional means every layer may only call the layer directly beneath it. Access must strictly flow from top to bottom; lower layers must not call upper layers; cross-layer access is forbidden. Only specific layers (such as the logic layer) and shared modules may perform horizontal calls; all other layers must not make horizontal calls.
Using a three-tier architecture (view layer, logic layer, data layer) as an example—this is only an illustration of the principle, not a requirement to adopt a three-tier design:
- View Layer → Logic Layer → Data Layer (one-way access).
- view layer: May access any logic layer. Accessing the data layer is strictly prohibited (i.e., no cross-layer calls). Horizontal calls are also prohibited.
- logic layer: Horizontal calls within the logic layer are allowed (i.e., logic modules may call each other). It may access only the data layer of its own module. Accessing data layers of other modules is prohibited. Accessing the view layer is prohibited.
- data layer: Accessing the logic layer or the view layer is prohibited. Accessing data layers of other modules is also prohibited.
- All layers may use shared packages and shared data definitions (such as DTOs).

### Testing Strategy
[Explain your testing approach and requirements]

### Git Workflow
[Describe your branching strategy and commit conventions]

## Domain Context
[Add domain-specific knowledge that AI assistants need to understand]

## Important Constraints
[List any technical, business, or regulatory constraints]

## External Dependencies
[Document key external services, APIs, or systems]
