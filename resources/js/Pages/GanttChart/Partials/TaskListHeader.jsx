import * as React from "react";

export default function TaskListHeader({}) {
    return (
        <div className='_3_ygE border-r-[0.5px]' style={{ fontFamily: "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue", fontSize: "9px" }}>
            <div className="_1nBOt h-12">
                <div className="_WuQ0f pl-1 min-w-[155px]">Task Name</div>
                <div className="_2eZzQ mt-2.5 h-[25px]" />
                <div className="_WuQ0f pl-1 min-w-[155px]" >Period</div>
                <div className="_2eZzQ mt-2.5 h-[25px]" />
                <div className="_WuQ0f pl-1 min-w-[155px]" >Progress</div>
                <div className="_2eZzQ mt-2.5 h-[25px]" />
                <div className="_WuQ0f pl-1 min-w-[40px]" >Action</div>
                {/* 他のヘッダー項目 */}
            </div>
        </div>
    );
};