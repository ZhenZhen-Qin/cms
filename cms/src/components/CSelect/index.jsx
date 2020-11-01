import React from 'react';
import { Select } from 'antd';
const { Option } = Select;
class CSelect extends React.Component {
    render() {
        let { data, mode = "", onSelect, onChange, showTotal, labelFormat,labelValue,hint,value,allowClear,tokenSeparators,...resetProps} = this.props;
        if(typeof data !== 'object'){
            data=[];
        }

        const selectProps = {
            mode,
            value,
            onChange,
            onSelect,
            placeholder: hint,
            showSearch: true,
            allowClear: typeof allowClear !== 'undefined' ? allowClear : true,
            optionFilterProp: 'children',
            filterOption: (input, option) => {
              return option.props.children.toLowerCase().indexOf(input) >= 0
            }
          };
      
          return (
            <Select
              {...selectProps}
              {...resetProps}
            >
              {showTotal && <Option value="">全部</Option>}
              {data.map(function (item) {
                return <Option key={item.value} value={item.value}>{item.label}</Option>
              })}
            </Select>
          );
    }
}

export default CSelect;