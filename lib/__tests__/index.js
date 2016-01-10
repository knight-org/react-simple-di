/* */

import {describe, it} from 'mocha';
import {expect} from 'chai';
import {injectDeps, useDeps} from '../';
import {shallow} from 'enzyme';
import React from 'react';

describe('Depedancy Injection', () => {
  it('should inject context and allow to use them', () => {
    const context = {name: 'arunoda'};
    const Layout = ({children}) => children;
    const LayoutWithDeps = injectDeps(context)(Layout);

    const Comp = ({name}) => (<p>{name}</p>);
    const mapper = (context) => ({
      name: context.name
    });
    const CompWithDeps = useDeps(mapper)(Comp);

    const el = shallow((
      <div>
        <LayoutWithDeps>
          <CompWithDeps />
        </LayoutWithDeps>
      </div>
    ));

    expect(el.html()).to.match(/arunoda/);
  });

  it('should inject actions and allow to use them', () => {
    const context = {name: 'arunoda'};
    const actions = {
      default: {
        getFullName({name}, surname) {
          return `${name}-${surname}`;
        }
      }
    };
    const Layout = ({children}) => children;
    const LayoutWithDeps = injectDeps(context, actions)(Layout);

    const Comp = ({getName}) => (<p>{getName('susiripala')}</p>);
    const mapper = (context, actions) => ({
      getName: actions.default.getFullName
    });
    const CompWithDeps = useDeps(mapper)(Comp);

    const el = shallow((
      <div>
        <LayoutWithDeps>
          <CompWithDeps />
        </LayoutWithDeps>
      </div>
    ));

    expect(el.html()).to.match(/arunoda-susiripala/);
  });

  it('should use a default mapper if no mapper is provided', () => {
    const context = {name: 'arunoda'};
    const actions = {
      default: {
        getFullName({name}, surname) {
          return `${name}-${surname}`;
        }
      }
    };
    const Layout = ({children}) => children;
    const LayoutWithDeps = injectDeps(context, actions)(Layout);

    const Comp = ({context, actions}) => (<p>{
      actions().default.getFullName(context().name)
    }</p>);
    const CompWithDeps = useDeps()(Comp);

    const el = shallow((
      <div>
        <LayoutWithDeps>
          <CompWithDeps />
        </LayoutWithDeps>
      </div>
    ));

    expect(el.html()).to.match(/arunoda-arunoda/);
  });

  it('should preseve original props', () => {
    const context = {};
    const Layout = ({children}) => children;
    const LayoutWithDeps = injectDeps(context)(Layout);

    const Comp = ({name}) => (<p>{name}</p>);
    const CompWithDeps = useDeps()(Comp);

    const el = shallow((
      <div>
        <LayoutWithDeps>
          <CompWithDeps name="arunoda"/>
        </LayoutWithDeps>
      </div>
    ));

    expect(el.html()).to.match(/arunoda/);
  });
});

describe('Misc', () => {
  describe('static fields', () => {
    it('should preseve when injecting deps', () => {
      const Layout = () => (<p></p>);
      Layout.theme = 'light';

      const LayoutWithDeps = injectDeps({})(Layout);
      expect(LayoutWithDeps.theme).to.be.equal('light');
    });

    it('should preseve when using deps', () => {
      const Comp = () => (<p></p>);
      Comp.theme = 'light';

      const CompWithDeps = useDeps()(Comp);
      expect(CompWithDeps.theme).to.be.equal('light');
    });
  });

  describe('displayName', () => {
    it('should extend when injecting deps', () => {
      const Layout = () => (<p></p>);
      Layout.displayName = 'TheLayout';

      const LayoutWithDeps = injectDeps({})(Layout);
      expect(LayoutWithDeps.displayName).to.be.equal('WithDeps(TheLayout)');
    });

    it('should extend when using deps', () => {
      const Comp = () => (<p></p>);
      Comp.displayName = 'TheComp';

      const CompWithDeps = useDeps()(Comp);
      expect(CompWithDeps.displayName).to.be.equal('UseDeps(TheComp)');
    });
  });
});