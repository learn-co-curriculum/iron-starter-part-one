import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import App from '../../src/App';
import Home from '../../src/components/Home';
import Campaigns from '../../src/containers/Campaigns';

describe('App', () => {
  let wrapper;
                          
  beforeEach(() => {
    wrapper = shallow(<App />);
  })

  it('renders two different routes', () => {
    expect(wrapper.find('Route').length).to.eq(2, "The App isn't rendering two different Routes");
  });

  it('renders the home component when the route is "/"', () => {
    const route = wrapper.find({ path: '/' });
    expect(route.node.props.component).to.eq(Home, "The App isn't rendering the Home component when the route is '/'");
  });

  it('renders the campaigns container when the route is "/campaigns"', () => {
    const route = wrapper.find({ path: '/campaigns' });
    expect(route.node.props.component).to.eq(Campaigns, "The App isn't rendering the Campgains container when the route is '/campaigns'");
  });
});
