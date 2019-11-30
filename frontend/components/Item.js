import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Title from './styles/Title'
import ItemStyles from './styles/ItemStyles'; 
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';


export default class Item extends Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        // could used shape({}) and then specify exactly what the contents are (i.e. title, price, etc) rather than object
    }

    render() {
        const item = this.props.item;
        // const { item } = this.props
        return (
            <ItemStyles>
                {/* checks if there is an item image -- will only run if true */}
                {item.image && <img src={item.image} alt={item.title} />}
                <Title>
                    <Link
                        href={{
                            pathname: '/item',
                            query: { id: item.id },
                        }}    
                    >
                        <a>{item.title}</a>
                    </Link>
                </Title>
                <PriceTag>{formatMoney(item.price)}</PriceTag>
                <p>{item.description}</p>

                <div className="buttonList">
                    <Link href={{
                        pathname: "update",
                        query: { id: item.id }
                    }}>
                        <a>Edit</a>
                    </Link>
                    <button>Add to Cart</button>
                    <button>Delete</button>
                </div>
            </ItemStyles>
        )}
};

