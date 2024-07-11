import * as React from 'react';
import { Text, Icon, Link, Label, Stack, IStackTokens, IStackStyles, IButtonStyles, Persona, PersonaSize, CommandBar, ITextStyles, IFontStyles, IconButton, ICommandBarItemProps } from '@fluentui/react';
import { RecordCardProps, ConfigItem } from '../../Interfaces/Common';

export class RecordCard extends React.Component<RecordCardProps, RecordCardProps> {
    constructor(props: RecordCardProps) {
      super(props);
      this.state = {
        key: this.props.key,
        personaImage: this.props.personaImage,
        header: this.props.header,
        body: this.props.body,
        footer: this.props.footer,
        FooterCollapsed: this.props.FooterCollapsed,
        commandbarItems: this.props.commandbarItems,
      }
      this.ToggleFooterCollapse = this.ToggleFooterCollapse.bind(this);
    }

    ToggleFooterCollapse = (event: any) => {
        this.setState((prevState) => ({
          FooterCollapsed: !prevState.FooterCollapsed,
        }));

        event.stopPropagation();
      };

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
            const textStyle = item.isBold ? { root: { fontWeight: 'bold' } } : { root: {} };
            const combinedStyles = applyCardTextStyles
              ? { ...textStyle, ...this.cardTextStyles }
              : textStyle;
    
            switch (item.type) {
              case 'Text':
                return (
                  <Text key={index} styles={combinedStyles} variant={ item.variant  as keyof IFontStyles | undefined }>
                    {item.content}
                  </Text>
                );
              case 'Icon':
                return <Icon key={index} iconName={item.iconName || ''} />;
              case 'Link':
                return (
                  <Link key={index} href={item.url} styles={combinedStyles}>
                    {item.content}
                  </Link>
                );
              case 'Label':
                return (
                  <Label key={index} styles={combinedStyles}>
                    {item.content}
                  </Label>
                );
              default:
                return null;
            }
          });
      }
    render() {
        return (
            <Stack horizontal>
                <Stack verticalAlign='center' horizontalAlign='center' styles={ { root: { width: '50px', marginLeft: '30px' } } }>
                    <Persona
                        imageUrl= {this.state.personaImage}
                        size={ PersonaSize.size56 }
                        // imageUrl={undefined} // Ensure imageUrl is null or undefined
                        // onRenderInitials={() => (
                        //   <Icon iconName={this.state.personaImage} style={{ fontSize: 32 }} />
                        // )}
                    ></Persona>
                </Stack>
                <Stack tokens={ this.cardStackTokens } grow styles={ this.cardStackStyles }>
                    <Stack horizontal styles={ this.genericTextStyles }>
                        {/* Header */}
                        <Stack horizontal grow verticalAlign='center'>
                            {this.renderConfigItems(this.state.header, false)}
                        </Stack>
                        {/* CommandBar */}
                        <Stack horizontalAlign='end'>
                            <CommandBar items={[
                                // { key: 'Assign', iconProps: { iconName: 'FollowUser' }, iconOnly: true, title: "Assign", buttonStyles: this.commandbarButtonStyles },
                                // { key: 'CloseActivity', iconProps: { iconName: 'CheckMark' }, iconOnly: true, title: "Close Activity", buttonStyles: this.commandbarButtonStyles },
                                // { key: 'OpenRecord', iconProps: { iconName: 'OpenInNewWindow' }, iconOnly: true, title: "Open Record", buttonStyles: this.commandbarButtonStyles },
                                // { key: 'AddToQueue', iconProps: { iconName: 'BuildQueueNew' }, iconOnly: true, title: "Add To Queue", buttonStyles: this.commandbarButtonStyles },
                                // { key: 'Delete', iconProps: { iconName: 'Delete' }, iconOnly: true, title: "Delete", buttonStyles: this.commandbarButtonStyles }
                                { key: 'OpenRecord', iconProps: { iconName: 'FollowUser' }, iconOnly: true, title: "Open Record", buttonStyles: this.commandbarButtonStyles },
                            ]}></CommandBar>
                        </Stack>
                    </Stack>
                    {/* Body */}
                    <Stack styles={ this.genericTextStyles }>
                        {this.renderConfigItems(this.state.body, true)}
                    </Stack>
                    {/* Footer */}
                    <Stack>
                        <Stack horizontal verticalAlign="center" styles={ this.genericTextStyles }>
                            {!this.state.FooterCollapsed && <Stack>{this.renderConfigItems(this.state.footer, true)}</Stack>}
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
                    </Stack>
                </Stack>
            </Stack>
        );
    }
}