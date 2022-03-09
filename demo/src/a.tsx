import {postCode_fileField_trans_list} from 'api/code_file';
import classNames from 'classnames';
import blurb from 'component-helper/blurb';
import {observer} from 'mobx-react';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/reduce';
import {Observable} from 'rxjs/Observable';
import FKSelectBase from './base';

@observer
export default class FKSelectAddMenu extends FKSelectBase {
  public static url = '/rest/tablemetadata/list_all';
  public static params = {
    ordering: '-order',
  };

  public static fields = [];
  public static handleResult() {
    return (reslut: any) => {
      if (!reslut.list.length) {
        return Observable.of(reslut.list);
      }
      const promise = postCode_fileField_trans_list({
        data: {
          data: JSON.stringify(
            reslut.list.reduce(
              (pre, cur) => ((pre[cur.model_name] = '__self__'), pre),
              {}
            )
          ),
        },
      }).then((res) =>
        reslut.list.map((item) => ({
          ...item,
          __name__: (
            res[item.model_name] || {
              __self__: item.model_name,
            }
          ).__self__,
        }))
      );

      return Observable.fromPromise(promise);
    };
  }
  public render() {
    const {data} = this.props;
    return (
      <div
        className={classNames('slds-p-left--x-small')}
        style={{
          whiteSpace: 'normal',
        }}
      >
        <span
          className={classNames('fa', data.icon)}
          style={styleNormalize({
            width: '1rem',
          })}
        />{' '}
        <span
          style={styleNormalize({
            'vertical-align': 'middle',
          })}
        >
          {data.__name__ || blurb.t(data.trans_key)}
        </span>
      </div>
    );
  }
}
