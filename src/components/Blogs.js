import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import axios from "axios";
import clientConfig from "../client-config";
import Loader from "./layouts/Loader";
import FeaturedImage from "./layouts/FeaturedImage";

const Blogs = () => {

	const [ pageNo, setPageNo ] = useState( 1 );
	const [ loading, setLoading ] = useState( false );
	const [ errMessage, setError ] = useState( '' );
	const [ posts, setPosts ] = useState( null );

	useEffect( () => {

		const wordPressSiteURL = clientConfig.siteUrl;

		setLoading( true );

		axios.get( `${ wordPressSiteURL }/wp-json/rae/v1/posts?page_no=${ pageNo }` )
			.then( res => {

				setLoading( false );

				if ( 200 === res.data.status ) {
					setPosts( res.data.posts_data );
				} else {
					setError( 'No posts found' );
				}
			} )
			.catch( err => {
				setError( err.response.data.message );
			} );

	}, [] );

	console.warn( 'posts', posts );

	return (
		<React.Fragment>
			<Navbar/>
			{ loading ? <Loader/> : '' }
			<div className="container" style={ { overflow: 'hidden' }  }>
				{ ( null !== posts && posts.length ) ? (
					posts.map( post => {
						return (
							<div className="post-wrapper" key={ post.id }>
								{ post.title ? <h2 className="post-title">{ post.title }</h2> : '' }
								{ post.attachment_image.img_sizes ? <FeaturedImage image={ post.attachment_image }/> : '' }
								<div className="post-meta">
									<div className="post-author">
										<i className="fa fa-user"></i>
									</div>
								</div>
							</div>
						)
					} )
				) : '' }
			</div>
		</React.Fragment>
	)
};

export default Blogs;
