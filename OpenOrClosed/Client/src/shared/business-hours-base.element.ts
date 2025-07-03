import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { html, LitElement, property, state } from '@umbraco-cms/backoffice/external/lit';

export interface HoursOfBusiness {
    opensAt: string | null;
    closesAt: string | null;
    comment: string;
    byAppointmentOnly?: boolean;
}

export interface BaseHoursConfig {
    excludeTimes?: boolean;
    defaultOpen?: string;
    defaultClose?: string;
    showAppointmentOnly?: boolean;
    timeFormat?: string;
    time_24hr?: boolean;
    labelOpen?: string;
    labelClosed?: string;
    hoursOptional?: boolean;
    closedHoursOptional?: boolean;
    hideCommentField?: boolean;
    reversed?: boolean;
    [key: string]: any;
}

export interface BaseDayInterface {
    isOpen: boolean;
    openComment: string;
    closedComment: string;
    hoursOfBusiness: HoursOfBusiness[];
}

export abstract class BusinessHoursBaseElement<T extends BaseDayInterface, C extends BaseHoursConfig> extends UmbElementMixin(LitElement) {
    
    @property({ type: Array })
    value: T[] = [];

    @property({ type: Object })
    config?: any;

    @state()
    protected _config: C = {} as C;

    @state()
    protected _days: T[] = [];

    protected abstract _defaultConfig: C;
    
    connectedCallback() {
        super.connectedCallback();
        this._mergeConfig();
        this._initializeValue();
    }

    protected _mergeConfig() {
        const mergedConfig = { ...this._defaultConfig };
        
        if (this.config) {
            Object.assign(mergedConfig, this.config);
        }
        
        // Convert string booleans to actual booleans
        const booleanProps = ['excludeTimes', 'time_24hr', 'showAppointmentOnly', 'reversed', 'hoursOptional', 'closedHoursOptional', 'hideCommentField'];
        booleanProps.forEach(prop => {
            if (typeof (mergedConfig as any)[prop] === 'string') {
                (mergedConfig as any)[prop] = (mergedConfig as any)[prop] === '1' || (mergedConfig as any)[prop] === 'true';
            }
        });
        
        this._config = mergedConfig;
    }

    protected abstract _initializeValue(): void;

    protected _createHours(): HoursOfBusiness {
        return {
            opensAt: null,
            closesAt: null,
            comment: '',
            byAppointmentOnly: false
        };
    }

    protected _updateValue() {
        this.value = [...this._days];
        this.dispatchEvent(new CustomEvent('property-value-change', {
            detail: {
                value: this.value
            }
        }));
    }

    protected _formatTime(time: string | null): string {
        if (!time) return '';
        
        if (this._config.time_24hr) {
            return time;
        }
        
        // Convert to 12-hour format
        const [hours, minutes] = time.split(':');
        const hour24 = parseInt(hours);
        const hour12 = hour24 % 12 || 12;
        const ampm = hour24 < 12 ? 'AM' : 'PM';
        return `${hour12}:${minutes} ${ampm}`;
    }

    protected _parseTimeInput(timeStr: string): string {
        if (!timeStr) return '';
        
        if (this._config.time_24hr) {
            return timeStr;
        }
        
        // Convert from 12-hour to 24-hour format
        const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return timeStr;
        
        let [, hours, minutes, ampm] = match;
        let hour24 = parseInt(hours);
        
        if (ampm.toUpperCase() === 'PM' && hour24 !== 12) {
            hour24 += 12;
        } else if (ampm.toUpperCase() === 'AM' && hour24 === 12) {
            hour24 = 0;
        }
        
        return `${hour24.toString().padStart(2, '0')}:${minutes}:00`;
    }

    protected _toggleDayOpen(index: number) {
        const day = this._days[index];
        day.isOpen = !day.isOpen;
        
        if (day.isOpen && day.hoursOfBusiness.length === 0) {
            day.hoursOfBusiness = [this._createHours()];
        } else if (!day.isOpen) {
            day.hoursOfBusiness = [];
        }
        
        this._days = [...this._days];
        this._updateValue();
    }

    protected _addHours(dayIndex: number) {
        if (!this._config.excludeTimes || !this._config.hoursOptional) {
            const day = this._days[dayIndex];
            day.hoursOfBusiness = [...day.hoursOfBusiness, this._createHours()];
            this._days = [...this._days];
            this._updateValue();
        }
    }

    protected _removeHours(dayIndex: number, hoursIndex: number) {
        const day = this._days[dayIndex];
        day.hoursOfBusiness = day.hoursOfBusiness.filter((_, i) => i !== hoursIndex);
        
        if (!this._config.hoursOptional && day.hoursOfBusiness.length === 0) {
            day.isOpen = false;
        }
        
        this._days = [...this._days];
        this._updateValue();
    }

    protected _updateTime(dayIndex: number, hoursIndex: number, field: 'opensAt' | 'closesAt', value: string) {
        this._days[dayIndex].hoursOfBusiness[hoursIndex][field] = value;
        this._updateValue();
    }

    protected _updateComment(dayIndex: number, field: 'openComment' | 'closedComment', value: string) {
        this._days[dayIndex][field] = value;
        this._updateValue();
    }

    protected _updateHoursComment(dayIndex: number, hoursIndex: number, value: string) {
        this._days[dayIndex].hoursOfBusiness[hoursIndex].comment = value;
        this._updateValue();
    }

    protected _toggleAppointmentOnly(dayIndex: number, hoursIndex: number) {
        const hours = this._days[dayIndex].hoursOfBusiness[hoursIndex];
        hours.byAppointmentOnly = !hours.byAppointmentOnly;
        this._days = [...this._days];
        this._updateValue();
    }

    protected _renderHoursSection(day: T, dayIndex: number) {
        return html`
            ${day.isOpen && !this._config.excludeTimes ? html`
                <div class="hours-section">
                    ${day.hoursOfBusiness.map((hours, hoursIndex) => html`
                        <div class="hours-row">
                            <div class="time-range">
                                <uui-input
                                    type="time"
                                    .value=${this._formatTime(hours.opensAt)}
                                    @change=${(e: Event) => {
                                        const value = this._parseTimeInput((e.target as HTMLInputElement).value);
                                        this._updateTime(dayIndex, hoursIndex, 'opensAt', value);
                                    }}
                                    placeholder="Open time">
                                </uui-input>
                                <span>to</span>
                                <uui-input
                                    type="time"
                                    .value=${this._formatTime(hours.closesAt)}
                                    @change=${(e: Event) => {
                                        const value = this._parseTimeInput((e.target as HTMLInputElement).value);
                                        this._updateTime(dayIndex, hoursIndex, 'closesAt', value);
                                    }}
                                    placeholder="Close time">
                                </uui-input>
                            </div>
                            
                            ${this._config.showAppointmentOnly ? html`
                                <uui-toggle
                                    .checked=${hours.byAppointmentOnly || false}
                                    @change=${() => this._toggleAppointmentOnly(dayIndex, hoursIndex)}
                                    label="By appointment only">
                                </uui-toggle>
                            ` : ''}
                            
                            <uui-button
                                look="secondary"
                                color="danger"
                                @click=${() => this._removeHours(dayIndex, hoursIndex)}>
                                <uui-icon name="delete"></uui-icon>
                            </uui-button>
                        </div>
                        
                        ${!this._config.hideCommentField ? html`
                            <uui-textarea
                                class="comment-field"
                                .value=${hours.comment}
                                @change=${(e: Event) => this._updateHoursComment(dayIndex, hoursIndex, (e.target as HTMLTextAreaElement).value)}
                                placeholder="Comment for these hours">
                            </uui-textarea>
                        ` : ''}
                    `)}
                    
                    ${!this._config.hideCommentField && day.hoursOfBusiness.length === 0 ? html`
                        <uui-textarea
                            class="comment-field"
                            .value=${day.openComment}
                            @change=${(e: Event) => this._updateComment(dayIndex, 'openComment', (e.target as HTMLTextAreaElement).value)}
                            placeholder="Reason for being ${this._config.labelOpen || 'open'}">
                        </uui-textarea>
                    ` : ''}
                    
                    <uui-button
                        look="secondary"
                        class="add-button"
                        @click=${() => this._addHours(dayIndex)}>
                        <uui-icon name="add"></uui-icon>
                        Add Hours
                    </uui-button>
                </div>
            ` : ''}
        `;
    }

    protected _renderClosedCommentField(day: T, dayIndex: number) {
        return html`
            ${!this._config.hideCommentField && !day.isOpen ? html`
                <uui-textarea
                    class="comment-field"
                    .value=${day.closedComment}
                    @change=${(e: Event) => this._updateComment(dayIndex, 'closedComment', (e.target as HTMLTextAreaElement).value)}
                    placeholder="Reason for being ${this._config.labelClosed || 'closed'}">
                </uui-textarea>
            ` : ''}
        `;
    }

}