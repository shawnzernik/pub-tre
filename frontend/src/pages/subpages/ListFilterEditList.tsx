import * as React from "react";
import { Form } from "../../components/Form";
import { Field } from "../../components/Field";
import { ListFilterDto } from "common/src/models/ListFilterDto";
import { Heading } from "../../components/Heading";
import { BasePage } from "../../components/BasePage";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { TextArea } from "../../components/TextArea";
import { SelectOption } from "../../components/SelectOption";

interface Props {
    value: ListFilterDto[];
    onChange?: (value: ListFilterDto[]) => void;
}

interface State {
    list: ListFilterDto[];
}

export class ListFilterEditList extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
    }

    public render(): React.ReactNode {
        const list: React.ReactElement[] = [];

        for (let cnt = 0; cnt < this.props.value.length; cnt++) {
            list.push(
                <Form>
                    <Field label="GUID" size={3}><Input
                        value={this.props.value[cnt].guid}
                    /></Field>
                    <Field label="Label" size={1}><Input
                        value={this.props.value[cnt].label}
                        onChange={(value) => {
                            const newList = BasePage.jsonCopy(this.props.value);
                            newList[cnt].label = value;
                            this.props.onChange(newList);
                        }}
                    /></Field>
                    <Field label="SQL Column" size={2}><Input
                        value={this.props.value[cnt].sqlColumn}
                        onChange={(value) => {
                            const newList = BasePage.jsonCopy(this.props.value);
                            newList[cnt].sqlColumn = value;
                            this.props.onChange(newList);
                        }}
                    /></Field>
                    <Field label="SQL Type" size={1}><Select
                        value={this.props.value[cnt].sqlType}
                        onChange={(value) => {
                            const newList = BasePage.jsonCopy(this.props.value);
                            newList[cnt].sqlType = value;
                            this.props.onChange(newList);
                        }}
                    >
                        <SelectOption display="" value="" />
                        <SelectOption display="bigint" value="bigint" />
                        <SelectOption display="bigserial" value="bigserial" />
                        <SelectOption display="boolean" value="boolean" />
                        <SelectOption display="bytea" value="bytea" />
                        <SelectOption display="char" value="char" />
                        <SelectOption display="date" value="date" />
                        <SelectOption display="double" value="double" />
                        <SelectOption display="int" value="int" />
                        <SelectOption display="interval" value="interval" />
                        <SelectOption display="money" value="money" />
                        <SelectOption display="numberic" value="numberic" />
                        <SelectOption display="real" value="real" />
                        <SelectOption display="serial" value="serial" />
                        <SelectOption display="smallint" value="smallint" />
                        <SelectOption display="text" value="text" />
                        <SelectOption display="time" value="time" />
                        <SelectOption display="timestamp" value="timestamp" />
                        <SelectOption display="varchar" value="varchar" />
                    </Select></Field>
                    <Field label="Options SQL"><TextArea
                        rows={10}
                        value={this.props.value[cnt].optionsSql}
                        onChange={(value) => {
                            const newList = BasePage.jsonCopy(this.props.value);
                            newList[cnt].optionsSql = value;
                            this.props.onChange(newList);
                        }}
                    /></Field>
                    <Field label="Default Compare" size={2}><Select
                        value={this.props.value[cnt].defaultCompare}
                        onChange={(value) => {
                            const newList = BasePage.jsonCopy(this.props.value);
                            newList[cnt].defaultCompare = value;
                            this.props.onChange(newList);
                        }}
                    >
                        <SelectOption display="" value="" />
                        <SelectOption display="Equals" value="e" />
                        <SelectOption display="Not Equal" value="ne" />
                        <SelectOption display="Less Than" value="lt" />
                        <SelectOption display="Less Then or Equals" value="lte" />
                        <SelectOption display="Greater Than" value="gt" />
                        <SelectOption display="Greater Than or Equals" value="gte" />
                        <SelectOption display="Null" value="n" />
                        <SelectOption display="Not Null" value="nn" />
                        <SelectOption display="Contains" value="c" />
                        <SelectOption display="Does Not Contain" value="dnc" />
                    </Select></Field>
                    <Field label="Default Value" size={2}><Input
                        value={this.props.value[cnt].defaultValue}
                        onChange={(value) => {
                            const newList = BasePage.jsonCopy(this.props.value);
                            newList[cnt].defaultValue = value;
                            this.props.onChange(newList);
                        }}
                    /></Field>
                </Form>
            );
        }

        return <>
            <Heading level={2}>List Filters</Heading>
            {list}
        </>;
    }
}
