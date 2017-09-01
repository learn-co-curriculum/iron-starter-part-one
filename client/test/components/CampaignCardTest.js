import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import CampaignCard from '../../src/components/CampaignCard';

describe('CampaignCard', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = shallow(<CampaignCard campaign={{ title: 'Throw me a Party' }} />);
  });

  it('renders the title of the campaign', () => {
    const header = wrapper.find('h2');
    expect(header.length).to.eq(1, "The campaign card isn't rendering exactly one h2");
    expect(header.text()).to.eq('Throw me a Party', "The Campaign Card isn't rendering the title of the campaign");
  });
});
