﻿namespace SAKURA.NZB.Business.Cache
{
	public interface ICache
    {
		void Update();
		int Index { get; }
    }
}
