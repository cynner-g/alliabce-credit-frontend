import React from 'react';

export const Loading = (props) => {
    return (
        <div className="col-4 offset-4 text-align-center">
            <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
            <p>Loading {props.title}</p>
        </div>
    )
}

export const Updating = (props) => {
    return (
        <div className="col-4 offset-4 text-align-center">
            <p><span className="fa fa-spinner fa-pulse fa-fw text-muted"></span>
                Updating {props.info}</p>
        </div>
    )
}

export const Spinner = (props) => {
    return (
        <div className="col-4 offset-4 text-align-center">
            <p><span className="fa fa-spinner fa-pulse fa-fw text-muted"></span>
                {props.info}</p>
        </div>
    )
}