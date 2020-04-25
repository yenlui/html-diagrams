
export interface Branch {
    label: string
    from: string
}

export interface BranchElement {
    label: string
    branch: string
}

export interface BranchingChartOptions {
    legend?: boolean
    useDivOnly?: boolean
}

function createElement(elementName: string, useDivOnly: boolean | undefined, label?: string): HTMLElement {
    if (useDivOnly) {
        const element = document.createElement('div')
        element.className = elementName
        if (label) element.innerText = label
        return element
    } else {
        const element = document.createElement(elementName)
        if (label) element.innerText = label
        return element
    }
}

function buildActiveBranches(branch: string, branches: Branch[], activeBranches: string[]): string[] {
    const currentBranch = branches.find(b => b.label === branch)
    activeBranches.push(branch)

    if (currentBranch?.from !== undefined) {
        return buildActiveBranches(currentBranch.from, branches, activeBranches)
    } else {
        return activeBranches
    }
}

/**
 *
 * @param branches of the chart, the first one must be the root
 */
export function generateBranchingChart(branches: Branch[] = [], elements: BranchElement[] = [], options: BranchingChartOptions = {}) {
    const existingBranches: string[] = []
    let chart = createElement('branching-chart', options.useDivOnly)
    options = {
        legend: true,
        useDivOnly: false,
        ...options
    }
    console.log(options)


    elements.forEach(element => {
        const brancheElementLine = createElement('branching-chart-element', options.useDivOnly)
        const brancheElementLabel = createElement('branching-chart-element-label', options.useDivOnly, element.label)
        brancheElementLabel.innerText = element.label

        let branchIsStarting = false
        if (existingBranches.indexOf(element?.branch) < 0) {
            existingBranches.push(element?.branch)
            branchIsStarting = true
        }

        const activeBranches = buildActiveBranches(element.branch, branches, [])
        console.log(activeBranches)

        branches.forEach(branch => {
            const branchElement = createElement('branching-chart-branch', options.useDivOnly)

            if (element.branch === branch.label) {
                branchElement.classList.add("current")
                if (branchIsStarting) branchElement.classList.add("starting")
            }

            if (activeBranches.indexOf(branch.label) >= 0) branchElement.classList.add("active")
            if (existingBranches.indexOf(branch.label) < 0) branchElement.classList.add("hidden")

            brancheElementLine.appendChild(branchElement)
        });

        brancheElementLine.appendChild(brancheElementLabel)
        chart.appendChild(brancheElementLine)
    });

    if (options.legend) {
        const legend = createElement('legend', options.useDivOnly, `Diagram for ${branches.length} branches, ${elements.length} elements`)
        chart.appendChild(legend)
    }

    return chart
}

