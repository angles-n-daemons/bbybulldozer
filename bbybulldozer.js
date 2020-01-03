class Bulldozer {
    constructor() {
        this.bulldozerId = null;
		this.start = this.start.bind(this);
		this.checkAndMerge = this.checkAndMerge.bind(this);
		this.deleteBranch = this.deleteBranch.bind(this);
		this.getUpdateButton = this.getUpdateButton.bind(this);
		this.getMergeButton = this.getMergeButton.bind(this);
		this.getMergeCommitButton = this.getMergeCommitButton.bind(this);
		this.getDeleteButton = this.getDeleteButton.bind(this);
    }

    start(e) {
		e.toElement.disabled = true;
		e.toElement.style.background = 'grey';
		this.checkAndMerge();
        this.bulldozerId = setInterval(() => this.checkAndMerge(), 10000);
    }

    checkAndMerge() {
        const me = this;
        const updateButton = me.getUpdateButton()
        const startMergeButton = me.getMergeButton();

        if (startMergeButton && !startMergeButton.disabled) {
            console.log('bbybulldozer: merging your pr');
            startMergeButton.click();

            setTimeout(function() {
                const mergeCommitButton = me.getMergeCommitButton()
                mergeCommitButton.click();
                clearInterval(me.bulldozerId);

                setTimeout(function(){
                    me.deleteBranch();    
                }, 2000);
            }, 2000)
        }
        else if (updateButton && !updateButton.disabled) {
            console.log('bbybulldozer: updating updating your pr with mainline');
            updateButton.click()
        } else {
            console.log('bbybulldozer: waiting to merge');
        }
    }

    deleteBranch() {
        const me = this;
        setTimeout(function() {
            const deleteButton = me.getDeleteButton();
            if (deleteButton && confirm('Delete this branch?')) {
                deleteButton.click();
            }
        }, 2000);
    }

    getUpdateButton() {
        const updateSelection = document.querySelectorAll('.mergeability-details .branch-action-btn.js-immediate-updates button');
        if (updateSelection.length) {
            return updateSelection[0];
        }
        return undefined;
    }

    getMergeButton() {
        const mergeSelection = document.querySelectorAll('.mergeability-details .select-menu .btn-group-merge');
        if (mergeSelection.length) {
            return mergeSelection[0];
        }
        return undefined;
    }

    getMergeCommitButton() {
        const mergeSelection = document.querySelectorAll('.js-merge-commit-button');
        if (mergeSelection.length) {
            return mergeSelection[0];
        }
        return undefined;
    }

    getDeleteButton() {
        const deleteSelection = document.querySelectorAll('.branch-action .post-merge-message button');
        if (deleteSelection.length) {
            return deleteSelection[0];
        }
        return undefined;
    }
}


function drawBulldozer(bulldozer) {
    const bulldozerButton = document.createElement('BUTTON');
    bulldozerButton.textContent = 'BULLDOZE';
    bulldozerButton.classList = "btn btn-sm";
    bulldozerButton.onclick = bulldozer.start;
    bulldozerButton.style.background = '#f58f00';
    document.querySelectorAll('.gh-header-actions')[0].append(bulldozerButton);
}

function canBulldoze() {
    const statusButtonSelection = document.querySelectorAll('#partial-discussion-header .TableObject .State--green');
    return statusButtonSelection.length &&
           location.host.includes('github') &&
           location.pathname.includes('/pull/') &&
           !location.pathname.includes('/files');
}


function main() {
    console.log('bbybulldozer: initializing');
    const b = new Bulldozer();
    if (canBulldoze()) {
        drawBulldozer(b);
    }
}

main()
