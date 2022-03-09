import _get from 'lodash/get';
import {connectWithService} from 'crm_next/utils/ObserverConnect/ServiceConnect';
import {
  looseEqual as _q,
  looseIndexOf as _i,
  checkKeyCodes as _k,
  toNumber as _n,
} from 'crm_next/utils/renderHelperFunctions';
import {computed, action} from 'mobx';
import React from 'react';
import {styleNormalize} from 'crm_next/utils/styleNormalize';
import blurb from 'component-helper/blurb';
import {UserCardHunterService} from './hunter.service';
const BLURB = {
  ACCEPT: blurb.t('Pass'),
  REJECT: blurb.t('Reject'),
  PENDING: blurb.t('Pending'),
};

export const UserCardHunter = connectWithService(UserCardHunterService)(
  function _UserCardHunter($props) {
    const {$service} = $props;
    const $sd = $service.$dataProxy;
    const $parentClassName = $props.className;
    const $mountEl = $service.$mountEl.bind($service);
    const buildInternalLink = $service.buildInternalLink;
    const mailto = $service.mailto.bind($service);
    const sendSms = $service.sendSms.bind($service);
    return (
      <div
        {...$service.nativeOns}
        className={$parentClassName}
        style={$service.$parentStyle}
        ref={$mountEl}
      >
        <div className="fz14 gllue-dark-blue height-20 slds-m-bottom--small fw500">
          {blurb.t('PortalApplyRecommend')}
        </div>
        <ul className="slds-dropdown__list">
          <li className="slds-dropdown__item">
            <div
              style={styleNormalize({
                'justify-content': 'flex-start',
              })}
            >
              <span className="slds-show_inline-block" style={{width: '75px'}}>
                {blurb.t('referee')}:
              </span>
              <a
                className="gllue-dark-blue-60"
                href={buildInternalLink('glluemeuser', 'detail', $sd.id)}
                target="_blank"
              >
                {$sd.message.name}
              </a>
            </div>
          </li>{' '}
          {$sd.message.company ? (
            <li className="slds-dropdown__item">
              <div>
                <span
                  className="slds-show_inline-block"
                  style={{width: '75px'}}
                >
                  {blurb.t('Hunter Company')}:
                </span>
                <a
                  className="gllue-dark-blue-60"
                  href={buildInternalLink(
                    'huntingcompany',
                    'detail',
                    _get($sd.message, 'company.id')
                  )}
                  target="_blank"
                >
                  {_get($sd.message, 'company.name')}
                </a>
              </div>
            </li>
          ) : null}{' '}
          <li className="slds-dropdown__item">
            <div>
              <span className="slds-show_inline-block" style={{width: '75px'}}>
                {blurb.t('Mail Box')}:
              </span>
              <a
                className="gllue-dark-blue-60"
                href={'mailto:' + $sd.message.email}
                onClick={($event) => {
                  $event.preventDefault();
                  return mailto($event);
                }}
              >
                {$sd.message.email}
              </a>
            </div>
          </li>{' '}
          <li className="slds-dropdown__item">
            <div>
              <span className="slds-show_inline-block" style={{width: '75px'}}>
                {blurb.t('mobile')}:
              </span>
              <a
                className="gllue-dark-blue-60"
                href="javascript:void(0);"
                onClick={($event) => {
                  $event.preventDefault();
                  return sendSms($event);
                }}
              >
                {$sd.message.mobile}
              </a>
            </div>
          </li>{' '}
          <li className="slds-dropdown__item">
            <div>
              <span className="slds-show_inline-block" style={{width: '75px'}}>
                {blurb.t('Feedback')}:
              </span>
              {$sd.status === 'Pass' ? (
                <span
                  className="label slds-show--inline-block field-container"
                  style={styleNormalize({
                    'background-color': 'rgb(0, 136, 204)',
                  })}
                >
                  {BLURB.ACCEPT}
                </span>
              ) : $sd.status === 'Reject' ? (
                <span
                  className="label slds-show--inline-block field-container"
                  style={styleNormalize({
                    'background-color': 'rgb(0, 0, 0)',
                  })}
                >
                  {BLURB.REJECT}
                </span>
              ) : (
                <span
                  className="label"
                  style={styleNormalize({
                    'background-color': 'rgb(191, 191, 191)',
                  })}
                >
                  {BLURB.PENDING}
                </span>
              )}
            </div>
          </li>{' '}
        </ul>
      </div>
    );
  }
);
