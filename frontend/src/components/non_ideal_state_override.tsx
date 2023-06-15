import * as React from "react";
import * as Blueprint from "@blueprintjs/core";

import classNames from "classnames";

export interface IdealStateProps extends Blueprint.NonIdealStateProps {
    /**
     * The intent of the component. If left undefined, the icon will use a muted style.
     */
    iconIntent?: Blueprint.Intent;
}

/**
 * A variaint of NonIdealState which supports setting the icon intent.
 */
export class NonIdealStateOverride extends Blueprint.AbstractPureComponent<IdealStateProps> {
    private nonIdealState: Blueprint.NonIdealState;

    public constructor(props: IdealStateProps) {
        super(props);
        this.nonIdealState = new Blueprint.NonIdealState(props);
        this.nonIdealState["maybeRenderVisual"] = this.maybeRenderVisualOverride;
    }

    public static defaultProps: Partial<IdealStateProps> = {
        iconSize: Blueprint.NonIdealStateIconSize.STANDARD,
        layout: "vertical"
    };

    public render() {
        return this.nonIdealState.render();
    }

    private maybeRenderVisualOverride() {
        const { icon, iconIntent, iconSize } = this.props;
        if (icon == null) {
            return undefined;
        }
        return (
            <div
                className={classNames(!iconIntent && Blueprint.Classes.NON_IDEAL_STATE_VISUAL)}
                style={{ fontSize: `${iconSize}px`, lineHeight: `${iconSize}px` }}
            >
                <Blueprint.Icon icon={icon} intent={iconIntent} size={iconSize} aria-hidden={true} tabIndex={-1} />
            </div>
        );
    }
}