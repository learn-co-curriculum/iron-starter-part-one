import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react'

import Home from '../../src/components/Home'

describe('Home', () => {
  let wrapper; 
  
  beforeEach(() => {
    wrapper = shallow(<Home />);
  });
    
  it('renders a link to "/campaigns"', () => {
    const link = wrapper.find('Link');
    expect(link.length).to.eq(1, "The Home component isn't rendering any Links");
    expect(link.node.props.to).to.eq('/campaigns', "The Link in the Home Component doesn't go to '/campaigns'");
  });
});
