import * as React from 'react';
import { Text, Icon, Link, Label, Stack, IStackTokens, IStackStyles, IButtonStyles, Persona, PersonaSize, CommandBar, ITextStyles, IFontStyles, IconButton, ICommandBarItemProps, PersonaPresence, PersonaInitialsColor } from '@fluentui/react';
import { RecordCardProps, ConfigItem, ParameterizedTarget } from '../../Interfaces/AppTypes';
import { DataSource } from '../../Api/DataSource';

export class RecordCard extends React.Component<RecordCardProps, RecordCardProps> {
  constructor(props: RecordCardProps) {
    super(props);
    const commandBarItems: ICommandBarItemProps[] = this.props.ConfigData.map(item => ({
      key: item.Key,
      iconProps: { iconName: item.IconName },
      iconOnly: true,
      title: item.Title,
      buttonStyles: this.commandbarButtonStyles,
      onClick: () => this.HandleCommandClick(item.OperationType, item.Url),
    }));
    const entity = this.props.PersonaColorCodes.find(item => item.EntityName === this.props.Record["entityDisplayName"]);

    this.state = {
      Key: this.props.Key,
      PersonaBackgroundValue: (entity ? entity.ColorCode : 0),
      RecordUiTemplate: this.props.RecordUiTemplate,
      FooterCollapsed: this.props.FooterCollapsed,
      ConfigData: this.props.ConfigData,
      CommandbarItems: commandBarItems,
      Record: this.props.Record,
      PersonaColorCodes: this.props.PersonaColorCodes,
    }
    this.ToggleFooterCollapse = this.ToggleFooterCollapse.bind(this);
    this.HandleCommandClick = this.HandleCommandClick.bind(this);
  }

  ToggleFooterCollapse = (event: any) => {
    this.setState((prevState) => ({
      FooterCollapsed: !prevState.FooterCollapsed,
    }));

    event.stopPropagation();
  }

  HandleCommandClick(operationType: string, url: ParameterizedTarget) {
    switch(operationType.toLowerCase())
    {
      case "openurl":
        if (url) {
          let targetUrl = url.Target;
          url.Parameters.forEach(param => {
            const placeholder = `{${param.Sequence}}`;
            let value = '';
            if (param.Type === "Parameter" && this.state.Record) {
                value = this.state.Record[param.Variable];
            }
            targetUrl = targetUrl.replace(placeholder, (value ?? ''));
          });
          DataSource.Context.navigation.openUrl(targetUrl);
          console.log('Opening the url: ' + targetUrl);
        }
        break;
    }
  }

  componentDidUpdate(prevProps: RecordCardProps) {
    if(prevProps.FooterCollapsed !== this.props.FooterCollapsed) {
      this.setState((prevState) => ({
        ...prevState,
        FooterCollapsed: this.props.FooterCollapsed,
      }));
    }
  }
  
  // Define tokens for spacing
  cardStackTokens: IStackTokens = { childrenGap: 0 };

  // Define styles for setting css attributes
  cardStackStyles: IStackStyles = { root: { border: '1px solid #ccc', borderRadius: '4px' } };
  cardTextStyles: ITextStyles = { root: { color: '#666' } };
  commandbarButtonStyles: IButtonStyles = { root: { padding: '4px 8px', fontSize: '12px', height: '32px' }, rootHovered: { padding: '4px 8px', fontSize: '12px', height: '32px' }, rootPressed: { padding: '4px 8px', fontSize: '12px', height: '32px' } };
  footerTextStylesCollapse: IStackStyles  = { root: { ':hover': { backgroundColor: 'rgb(245, 245, 245)' }, paddingLeft: '10px' } };
  genericTextStyles: IStackStyles  = { root: { paddingLeft: '10px' } };
 
  renderConfigItems(items: ConfigItem[], applyCardTextStyles: boolean) {
    return items
      .sort((a, b) => a.sequence - b.sequence)
      .map((item, index) => {
        let content = '';
        if(item.content) {
          content = item.content.Target;
          item.content.Parameters.forEach(param => {
            const placeholder = `{${param.Sequence}}`;
            let value = '';
            if (param.Type === "Parameter" && this.state.Record) {
                value = this.state.Record[param.Variable] || '';
            }
            content = content.replace(placeholder, (value ?? ''));
          });
        }

        const textStyle = item.isBold ? { root: { fontWeight: 'bold' } } : { root: {} };
        const combinedStyles = applyCardTextStyles
          ? { ...textStyle, ...this.cardTextStyles }
          : textStyle;

        switch (item.type) {
          case 'Text':
            return (
              <Text key={index} styles={combinedStyles} variant={ item.variant  as keyof IFontStyles | undefined }>
                {content}
              </Text>
            );
          case 'Icon':
            return <Icon key={index} iconName={item.iconName || ''} />;
          case 'Link':
            return (
              <Link key={index} href={item.url} styles={combinedStyles}>
                {content}
              </Link>
            );
          case 'Label':
            return (
              <Label key={index} styles={combinedStyles}>
                {content}
              </Label>
            );
          default:
            return null;
        }
      });
  }

  render() {
    return (
        <Stack horizontal key={ this.state.Key }>
            <Stack verticalAlign='center' horizontalAlign='center' styles={ { root: { width: '50px', marginLeft: '30px' } } }>
              <Persona
                size={ PersonaSize.size56 }
                presence={PersonaPresence.none}
                initialsColor={this.state.PersonaBackgroundValue}
                imageInitials={(this.state.Record["entityDisplayName"].length > 0) ? this.state.Record["entityDisplayName"].toUpperCase().charAt(0) : 'R' }
                // imageUrl={undefined} // Ensure imageUrl is null or undefined
                // onRenderInitials={() => (
                //   <Icon iconName={this.state.PersonaImage} style={{ fontSize: 32 }} />
                // )}
              ></Persona>
            </Stack>
            <Stack tokens={ this.cardStackTokens } grow styles={ this.cardStackStyles }>
              <Stack horizontal styles={ this.genericTextStyles }>
                {/* Header */}
                <Stack horizontal grow verticalAlign='center'>
                  {this.renderConfigItems(this.state.RecordUiTemplate.Header || [], false)}
                </Stack>
                {/* CommandBar */}
                <Stack horizontalAlign='end'>
                  {this.state.CommandbarItems && <CommandBar items={this.state.CommandbarItems}></CommandBar> }
                </Stack>
              </Stack>
              {/* Body */}
              <Stack styles={ this.genericTextStyles }>
                {this.renderConfigItems(this.state.RecordUiTemplate.Body || [], true)}
              </Stack>
              {/* Footer */}
              {(this.state.RecordUiTemplate.Footer || []).length > 0 && (
                <Stack>
                  <Stack horizontal verticalAlign="center" styles={ this.genericTextStyles }>
                    {!this.state.FooterCollapsed && <Stack>{this.renderConfigItems(this.state.RecordUiTemplate.Footer || [], true)}</Stack>}
                  </Stack>
                  <Stack horizontal onClick={ this.ToggleFooterCollapse } styles={ this.footerTextStylesCollapse }>
                    <Stack grow verticalAlign='center'>
                      <Link>
                        {!this.state.FooterCollapsed ? "View Less" : "View More"}
                      </Link>
                    </Stack>
                    <Stack horizontalAlign='end' verticalAlign='center'>
                      <IconButton
                        iconProps={{ iconName: this.state.FooterCollapsed ? 'ChevronDown' : 'ChevronUp' }}
                        ariaLabel={this.state.FooterCollapsed ? 'Expand Footer' : 'Collapse Footer'}
                        onClick={this.ToggleFooterCollapse}
                      />
                    </Stack>
                  </Stack>
                </Stack>)
              }
            </Stack>
        </Stack>
      );
  }
}