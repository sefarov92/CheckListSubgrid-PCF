import * as React from 'react';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { TextField } from '@fluentui/react/lib/TextField';
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import { List } from '@fluentui/react/lib/List';
import { Checkbox, Stack } from '@fluentui/react';
import { ITheme, mergeStyleSets, getTheme, getFocusStyle } from '@fluentui/react/lib/Styling';
import {IInputs} from "./generated/ManifestTypes";

export interface IProps {
  items: IItem[];
  openRecord: (id:string) => void;
  onChange: (id:string,checkedon:boolean|undefined) => void;
  pcfContext: ComponentFramework.Context<IInputs>,
}

export interface IItem {
  url: string;
  name: string;
  alternateText: string;
  id: string;
  description: string;
  twoOptions: boolean;
}

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;
const classNames = mergeStyleSets({
  container: {
    overflow: 'auto',
    maxHeight: 500,
  },
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 10,
      boxSizing: 'border-box',
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      display: 'flex',
      'border-width': '4px',
      'border-radius': '.25rem',
      'cursor': 'pointer',
      'padding-right': '1.5rem',
      'padding-left': '1.5rem',
      'padding-top': '1.5rem',
      'padding-bottom': '1rem',
      selectors: {
        '&:hover': { background: palette.neutralLight },
      },
    },
  ],
  itemImage: {
    flexShrink: 0,
  },
  itemContent: {
    marginLeft: 10,
    overflow: 'hidden',
    flexGrow: 1,
  },
  itemName: [
    fonts.xLarge,
    {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  ],
  itemIndex: {
    fontSize: fonts.small.fontSize,
    color: palette.neutralTertiary,
    marginBottom: 10,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: 10,
    color: palette.neutralTertiary,
    fontSize: fonts.large.fontSize,
    flexShrink: 0,
  },
});

export const CheckListGrid: React.FunctionComponent<IProps> = (props) => {  
  const [items, setItems] = React.useState(props.items);

  const onChange = React.useCallback(
    (id:string,ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean): void => {
      //console.log(`The option has been changed to ${isChecked}.`);
      let ischecked:boolean = !!checked;
      props.onChange(id,ischecked);
      props.pcfContext.parameters.listImageDataSet.refresh();
    },
    [],
  );

  React.useEffect(() => { 
      setItems(props.items);
    },
    [props.items],
  );

  const handleRecordClick = (id:string) : void => {
    props.openRecord(id);
  }

  const _onRenderCell = (item: IItem | undefined, index: number | undefined, isScrolling: boolean | undefined): JSX.Element => {
    let booltrue: boolean = Boolean("1");
    return (
      <div className={classNames.itemCell} >
            <Image
                className={classNames.itemImage}
                src={isScrolling ? undefined : item!.url}
                width={50}  
                height={50}
                imageFit={ImageFit.cover}
            />
            <div className={classNames.itemContent} data-is-focusable={true} onClick={handleRecordClick.bind({},item!.id)}>
            <div className={classNames.itemName}>{item!.name}</div>
            <div className={classNames.itemIndex}>{item!.description}</div>
            </div>
            <Checkbox checked={booltrue == item!.twoOptions ? true : false}  onChange={onChange.bind({},item!.id)} />
      </div>
    );
  };

    return (   
    <FocusZone direction={FocusZoneDirection.vertical}>
        <div className={classNames.container} data-is-scrollable>
          <TextField
            label="Filter by name:"
            onChange={event => {setItems(props.items.filter(i => i.name.toLowerCase().indexOf((event.target as HTMLInputElement).value.toLocaleLowerCase()) > -1));}}
            />
          <List items={items} onRenderCell={_onRenderCell} />
        </div>
    </FocusZone>  
    );
}